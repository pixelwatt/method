/* eslint-disable prettier/prettier */
/* eslint-disable @wordpress/no-unsafe-wp-apis */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from '@wordpress/element';
import {
    useBlockProps,
    InspectorControls,
    BlockControls,
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
    Button,
    Notice,
    Placeholder,
    Spinner,
    ExternalLink,
    ToolbarGroup,
    ToolbarButton,
    __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodDimensionControls from '../../components/MethodDimensionControls';
import MethodBorderControls from '../../components/MethodBorderControls';
import MethodShadowControl from '../../components/MethodShadowControl';
import MethodColorControls from '../../components/MethodColorControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import { useCanvasWindow } from '../../hooks/useCanvasViewport';
import {
    DEFAULT_CENTER,
    DEFAULT_CENTER_ZOOM,
    DEFAULT_ZOOM,
    MIN_ZOOM,
    MAX_ZOOM,
    PIN_HEIGHT,
    MIN_PIN_SCALE,
    MAX_PIN_SCALE,
    getMapboxStyles,
    isStyleUrl,
    resolveStyle,
    clampZoom,
    isPin,
    roundCoordinate,
    createMethodMap,
    loadMapboxGl,
    geocodeAddress,
} from '../../utils/mapbox';
import icon from './icon';

const TOKEN_URL = 'https://account.mapbox.com/access-tokens/';

// Only the vertical margins: the map fills its column.
const SPACING_SIDES = { padding: [], margin: ['top', 'bottom'], gap: [] };
const DIMENSIONS = ['height', 'minHeight', 'aspectRatio'];

// Public tokens are the only kind a browser may use.
function isPublicToken(token) {
    return /^pk\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test((token || '').trim());
}

function getSiteToken() {
    return (window?.methodMapboxData?.siteToken || '').trim();
}

function getGlUrls() {
    return window?.methodMapboxData?.gl || {};
}

function geocodeErrorMessage(error) {
    switch (error?.code) {
        case 'token':
            return __('Mapbox rejected the access token.', 'method');
        case 'network':
            return __('The address lookup failed. Check your connection and try again.', 'method');
        default:
            return __('Mapbox could not complete the address lookup.', 'method');
    }
}

// Dimensions, margins and border, for the base settings and each override tier.
function LayoutControls({ breakpoint, attributes, setAttributes }) {
    return (
        <>
            <MethodDimensionControls
                breakpoint={breakpoint}
                attributes={attributes}
                setAttributes={setAttributes}
                include={DIMENSIONS}
            />
            <MethodSpacingControls
                breakpoint={breakpoint}
                attributes={attributes}
                setAttributes={setAttributes}
                include={['margin']}
                sides={SPACING_SIDES}
            />
            <MethodBorderControls
                breakpoint={breakpoint}
                attributes={attributes}
                setAttributes={setAttributes}
            />
        </>
    );
}

export default function Edit({ attributes, setAttributes, clientId, isSelected }) {
    // Mirrors $cssargs in method-mapbox-map.php.
    const cssMap = {
        [`#block-${clientId}`]: [
            'height',
            'minHeight',
            'aspectRatioDimension',
            'margin-top',
            'margin-bottom',
            'borderRadius',
            'border',
            'boxShadow',
        ],
    };

    const {
        accessToken = '',
        address = '',
        geocodedAddress = '',
        lng,
        lat,
        zoom = DEFAULT_ZOOM,
        mapStyle = 'standard',
        customStyleUrl = '',
        pinColor,
        pinScale = 1,
        popupText = '',
        showNavigation = true,
        cooperativeGestures = true,
    } = attributes;

    const siteToken = getSiteToken();
    const token = siteToken || accessToken.trim();
    const hasPin = isPin(lng, lat);
    const styles = getMapboxStyles();
    const styleUrl = resolveStyle(mapStyle, customStyleUrl);
    const customStyleInvalid = mapStyle === 'custom' && !!customStyleUrl.trim() && !isStyleUrl(customStyleUrl);

    // The map is created by the Mapbox GL instance of the canvas (iframe) window.
    const [canvasRef, canvasWindow] = useCanvasWindow();
    const containerRef = useRef(null);
    const instanceRef = useRef(null);
    const [mapVersion, setMapVersion] = useState(0);
    const [gl, setGl] = useState({ ready: false, error: '', attempt: 0 });
    const [mapError, setMapError] = useState('');
    const [geocode, setGeocode] = useState({ status: 'idle', alternatives: [], error: '' });

    // Latest props for the map's event handlers, which are bound once.
    const latest = useRef({});
    latest.current = { isSelected, setAttributes };
    const mounted = useRef(true);
    useEffect(() => () => { mounted.current = false; }, []);

    // Whether the next pin change should bring the map to the pin: a looked-up
    // or typed location can be anywhere, a dragged or clicked one is in view.
    const recenterRef = useRef(false);
    const hadPinRef = useRef(hasPin);

    const placePin = (lngLat, extra = {}) => {
        latest.current.setAttributes({
            lng: roundCoordinate(lngLat.lng),
            lat: roundCoordinate(lngLat.lat),
            geocodedAddress: '',
            ...extra,
        });
    };

    // 1. Mapbox GL JS, loaded into the canvas window the first time a map needs it.
    useEffect(() => {
        if (!canvasWindow || !token) return undefined;
        let cancelled = false;
        loadMapboxGl(canvasWindow, getGlUrls()).then(
            () => { if (!cancelled && mounted.current) setGl((s) => ({ ...s, ready: true, error: '' })); },
            (error) => { if (!cancelled && mounted.current) setGl((s) => ({ ...s, ready: false, error: error.message })); }
        );
        return () => { cancelled = true; };
    }, [canvasWindow, !!token, gl.attempt]);

    // 2. The map: created once per token, then updated in place by the effects below.
    useEffect(() => {
        if (!gl.ready || !token || !canvasWindow || !containerRef.current) return undefined;
        const el = containerRef.current;
        const instance = createMethodMap(canvasWindow.mapboxgl, el, {
            token,
            style: styleUrl,
            center: hasPin ? [lng, lat] : DEFAULT_CENTER,
            zoom: hasPin ? clampZoom(zoom) : DEFAULT_CENTER_ZOOM,
            pin: null, // placed by the pin effect
            navigation: showNavigation,
            // The preview never traps the page's scrolling, whatever the frontend setting.
            cooperativeGestures: true,
        }, {
            onPinDragEnd: (lngLat) => placePin(lngLat),
        });

        // Clicking the selected block's map places the pin there.
        instance.map.on('click', (e) => {
            if (!latest.current.isSelected) return;
            const markerEl = instance.marker?.getElement();
            if (markerEl && markerEl.contains(e.originalEvent?.target)) return;
            placePin(e.lngLat);
        });
        instance.map.on('error', (e) => {
            const status = e?.error?.status;
            if (status === 401 || status === 403) {
                setMapError(__('Mapbox rejected the access token.', 'method'));
            }
        });

        // Height and width come from the generated CSS, so follow the container.
        const observer = new canvasWindow.ResizeObserver(() => instance.map.resize());
        observer.observe(el);

        instanceRef.current = instance;
        setMapError('');
        setMapVersion((v) => v + 1);

        return () => {
            observer.disconnect();
            instance.remove();
            instanceRef.current = null;
        };
    }, [gl.ready, token, canvasWindow]);

    // 3. Pin: position, look and popup.
    useEffect(() => {
        const instance = instanceRef.current;
        if (!instance) return;
        instance.setPin(hasPin ? { lng, lat, color: pinColor, scale: pinScale, popup: popupText, draggable: true } : null);
        if (hasPin && (!hadPinRef.current || recenterRef.current)) {
            instance.map.easeTo({ center: [lng, lat], zoom: clampZoom(zoom) });
        }
        recenterRef.current = false;
        hadPinRef.current = hasPin;
    }, [mapVersion, hasPin, lng, lat, pinColor, pinScale, popupText]);

    // 4. Initial zoom, previewed around the pin.
    useEffect(() => {
        const instance = instanceRef.current;
        if (!instance || !hasPin) return;
        const z = clampZoom(zoom);
        if (Math.abs(instance.map.getZoom() - z) < 0.01) return;
        instance.map.easeTo({ center: [lng, lat], zoom: z });
    }, [mapVersion, zoom]);

    // 5. Style and navigation buttons.
    useEffect(() => {
        instanceRef.current?.setStyle(styleUrl);
    }, [mapVersion, styleUrl]);
    useEffect(() => {
        instanceRef.current?.setNavigation(showNavigation);
    }, [mapVersion, showNavigation]);

    const centerOnPin = () => {
        if (!hasPin || !instanceRef.current) return;
        instanceRef.current.map.easeTo({ center: [lng, lat], zoom: clampZoom(zoom) });
    };

    // Address lookup: the best match is placed at once, the others offered.
    const applyResult = (result) => {
        recenterRef.current = true;
        setAttributes({
            lng: roundCoordinate(result.lng),
            lat: roundCoordinate(result.lat),
            geocodedAddress: result.label,
        });
    };
    const runGeocode = async () => {
        const query = address.trim();
        if (!query || !token || geocode.status === 'loading') return;
        setGeocode({ status: 'loading', alternatives: [], error: '' });
        try {
            const results = await geocodeAddress(query, token);
            if (!mounted.current) return;
            if (!results.length) {
                setGeocode({ status: 'empty', alternatives: [], error: '' });
                return;
            }
            applyResult(results[0]);
            setGeocode({ status: 'done', alternatives: results.slice(1), error: '' });
        } catch (error) {
            if (!mounted.current) return;
            setGeocode({ status: 'error', alternatives: [], error: geocodeErrorMessage(error) });
        }
    };

    const updateCoordinate = (key, value) => {
        const n = parseFloat(value);
        recenterRef.current = true;
        setAttributes({ [key]: Number.isFinite(n) ? roundCoordinate(n) : undefined, geocodedAddress: '' });
    };

    let pinStatus;
    if (hasPin && geocodedAddress) {
        /* translators: %s: address the pin was placed at */
        pinStatus = sprintf(__('Pin placed at %s. Drag it on the map to adjust.', 'method'), geocodedAddress);
    } else if (hasPin) {
        /* translators: 1: latitude, 2: longitude */
        pinStatus = sprintf(__('Pin placed by hand at %1$s, %2$s. Drag it on the map to adjust.', 'method'), lat, lng);
    } else {
        pinStatus = __('No pin yet. Look up an address, click the map, or enter coordinates.', 'method');
    }

    let note = '';
    if (!hasPin) {
        note = isSelected
            ? __('Click the map to place the pin, or look up an address in the block settings.', 'method')
            : __('No pin yet. Select the block to place one.', 'method');
    } else if (isSelected) {
        note = __('Drag the pin, or click the map to move it.', 'method');
    }

    const styleOptions = [
        ...Object.entries(styles).map(([value, style]) => ({ value, label: style.label })),
        { value: 'custom', label: __('Custom style URL', 'method') },
    ];

    const blockProps = useBlockProps({ className: 'method-mapbox-map', ref: canvasRef });

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarButton
                        icon="location"
                        label={__('Center map on pin', 'method')}
                        onClick={centerOnPin}
                        disabled={!hasPin || !gl.ready}
                    />
                </ToolbarGroup>
            </BlockControls>
            <InspectorControls>
                <PanelBody title={__('Map', 'method')}>
                    {!!siteToken && (
                        <p className="components-base-control__help" style={{ marginTop: 0 }}>
                            {__('Using the Mapbox access token shared by the theme.', 'method')}
                        </p>
                    )}
                    {!siteToken && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <TextControl
                                    label={__('Access token', 'method')}
                                    value={accessToken}
                                    onChange={(value) => setAttributes({ accessToken: value })}
                                    placeholder="pk.…"
                                    help={__('A public Mapbox token (pk.…) from your Mapbox account. It is saved with this block.', 'method')}
                                />
                                <ExternalLink href={TOKEN_URL}>{__('Mapbox access tokens', 'method')}</ExternalLink>
                                {!!accessToken.trim() && !isPublicToken(accessToken) && (
                                    <Notice status="warning" isDismissible={false}>
                                        {__('That does not look like a public token. Only public tokens (pk.…) work in the browser.', 'method')}
                                    </Notice>
                                )}
                            </div>
                        </PanelRow>
                    )}
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <SelectControl
                                label={__('Style', 'method')}
                                value={mapStyle}
                                options={styleOptions}
                                onChange={(value) => setAttributes({ mapStyle: value })}
                            />
                        </div>
                    </PanelRow>
                    {mapStyle === 'custom' && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '12px' }}>
                                <TextControl
                                    label={__('Style URL', 'method')}
                                    value={customStyleUrl}
                                    onChange={(value) => setAttributes({ customStyleUrl: value })}
                                    placeholder="mapbox://styles/username/style-id"
                                    help={__('A mapbox://styles/… URL from Mapbox Studio, or an https:// link to a style JSON. The Standard style is used until this is valid.', 'method')}
                                />
                                {customStyleInvalid && (
                                    <Notice status="warning" isDismissible={false}>
                                        {__('Style URLs start with mapbox://styles/ or https://.', 'method')}
                                    </Notice>
                                )}
                            </div>
                        </PanelRow>
                    )}
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <NumberControl
                                label={__('Initial zoom', 'method')}
                                value={zoom}
                                min={MIN_ZOOM}
                                max={MAX_ZOOM}
                                step={0.1}
                                isPressEnterToChange
                                onChange={(value) => {
                                    const n = parseFloat(value);
                                    setAttributes({ zoom: Number.isFinite(n) ? clampZoom(n) : DEFAULT_ZOOM });
                                }}
                                size="__unstable-large"
                            />
                            <p className="components-base-control__help">
                                {__('0 shows the whole world and 22 is street level; decimals such as 14.5 are fine. The map opens centered on the pin at this zoom.', 'method')}
                            </p>
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Zoom buttons', 'method')}
                            help={__('Zoom in, zoom out and compass buttons in the top-left corner of the map.', 'method')}
                            checked={showNavigation}
                            onChange={(value) => setAttributes({ showNavigation: value })}
                        />
                    </PanelRow>
                    <PanelRow>
                        <ToggleControl
                            label={__('Cooperative gestures', 'method')}
                            help={__('Scrolling over the map only zooms it with Ctrl or Cmd held, and panning by touch needs two fingers, so the page keeps scrolling normally. The editor preview always behaves this way.', 'method')}
                            checked={cooperativeGestures}
                            onChange={(value) => setAttributes({ cooperativeGestures: value })}
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={__('Pin', 'method')}>
                    <PanelRow>
                        <div className="method-mapbox-geocode" style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label={__('Address', 'method')}
                                value={address}
                                onChange={(value) => setAttributes({ address: value })}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter') {
                                        event.preventDefault();
                                        runGeocode();
                                    }
                                }}
                                placeholder={__('Street, city, or place', 'method')}
                            />
                            <Button
                                variant="secondary"
                                onClick={runGeocode}
                                disabled={!token || !address.trim() || geocode.status === 'loading'}
                                isBusy={geocode.status === 'loading'}
                            >
                                {__('Find on map', 'method')}
                            </Button>
                            {geocode.status === 'error' && (
                                <Notice status="error" isDismissible={false}>{geocode.error}</Notice>
                            )}
                            {geocode.status === 'empty' && (
                                <Notice status="warning" isDismissible={false}>
                                    {__('No match for that address.', 'method')}
                                </Notice>
                            )}
                            {geocode.status === 'done' && geocode.alternatives.length > 0 && (
                                <div className="method-mapbox-geocode-results">
                                    <p className="components-base-control__help">
                                        {__('Not the right place? Pick another match:', 'method')}
                                    </p>
                                    {geocode.alternatives.map((result, index) => (
                                        <Button key={index} variant="link" onClick={() => applyResult(result)}>
                                            {result.label}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </PanelRow>
                    <p className="components-base-control__help">{pinStatus}</p>
                    <PanelRow>
                        <div className="method-mapbox-coordinates" style={{ marginBottom: '12px' }}>
                            <NumberControl
                                label={__('Latitude', 'method')}
                                value={hasPin || Number.isFinite(lat) ? lat : ''}
                                min={-90}
                                max={90}
                                step={0.000001}
                                isPressEnterToChange
                                onChange={(value) => updateCoordinate('lat', value)}
                                size="__unstable-large"
                            />
                            <NumberControl
                                label={__('Longitude', 'method')}
                                value={hasPin || Number.isFinite(lng) ? lng : ''}
                                min={-180}
                                max={180}
                                step={0.000001}
                                isPressEnterToChange
                                onChange={(value) => updateCoordinate('lng', value)}
                                size="__unstable-large"
                            />
                        </div>
                    </PanelRow>
                    {hasPin && (
                        <PanelRow>
                            <Button
                                variant="tertiary"
                                isDestructive
                                onClick={() => setAttributes({ lng: undefined, lat: undefined, geocodedAddress: '' })}
                            >
                                {__('Remove pin', 'method')}
                            </Button>
                        </PanelRow>
                    )}
                    <PanelRow>
                        <div style={{ width: '100%' }}>
                            <RangeControl
                                label={__('Pin size', 'method')}
                                value={pinScale}
                                onChange={(value) => setAttributes({ pinScale: value })}
                                min={MIN_PIN_SCALE}
                                max={MAX_PIN_SCALE}
                                step={0.1}
                                help={sprintf(
                                    /* translators: %d: pin height in pixels */
                                    __('About %dpx tall. 1 is the size of Mapbox\'s default pin.', 'method'),
                                    Math.round(PIN_HEIGHT * pinScale)
                                )}
                            />
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '12px' }}>
                            <TextControl
                                label={__('Popup text', 'method')}
                                value={popupText}
                                onChange={(value) => setAttributes({ popupText: value })}
                                help={__('Shown in a popup when the pin is clicked, such as a venue name. Leave empty for no popup.', 'method')}
                            />
                        </div>
                    </PanelRow>
                    <p className="components-base-control__help">
                        {__('The pin color is set under Color Settings.', 'method')}
                    </p>
                </PanelBody>
                <LayoutControls breakpoint="base" attributes={attributes} setAttributes={setAttributes} />
                <MethodShadowControl
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                />
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={[]}
                    extra={[
                        {
                            colorValue: pinColor,
                            onColorChange: (value) => setAttributes({ pinColor: value }),
                            label: __('Pin', 'method'),
                        },
                    ]}
                />
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: <LayoutControls breakpoint="mobile" attributes={attributes} setAttributes={setAttributes} />,
                        tablet: <LayoutControls breakpoint="tablet" attributes={attributes} setAttributes={setAttributes} />,
                        wide: <LayoutControls breakpoint="wide" attributes={attributes} setAttributes={setAttributes} />,
                    }}
                />
            </InspectorControls>
            <div {...blockProps}>
                {!token && (
                    <Placeholder
                        icon={icon}
                        label={__('Mapbox Map', 'method')}
                        instructions={__('Enter a public Mapbox access token to show the map. It is saved with this block.', 'method')}
                    >
                        <div className="method-mapbox-map-token">
                            <TextControl
                                label={__('Access token', 'method')}
                                hideLabelFromVision
                                value={accessToken}
                                onChange={(value) => setAttributes({ accessToken: value })}
                                placeholder="pk.…"
                            />
                            <ExternalLink href={TOKEN_URL}>{__('Get a token', 'method')}</ExternalLink>
                        </div>
                    </Placeholder>
                )}
                {!!token && (
                    <>
                        <div className="method-mapbox-map-canvas" ref={containerRef} />
                        {(!gl.ready || !!gl.error || !!mapError) && (
                            <div className="method-mapbox-map-editor-status">
                                {gl.error || mapError ? (
                                    <Notice status="error" isDismissible={false}>
                                        {gl.error || mapError}
                                        {!!gl.error && (
                                            <Button
                                                variant="link"
                                                onClick={() => setGl((s) => ({ ...s, error: '', attempt: s.attempt + 1 }))}
                                            >
                                                {__('Retry', 'method')}
                                            </Button>
                                        )}
                                    </Notice>
                                ) : (
                                    <Spinner />
                                )}
                            </div>
                        )}
                        {gl.ready && !mapError && !!note && (
                            <div className="method-mapbox-map-editor-note">{note}</div>
                        )}
                    </>
                )}
                <MethodStyleTag
                    clientId={clientId}
                    attributes={attributes}
                    selectorMap={cssMap}
                />
            </div>
        </>
    );
}
