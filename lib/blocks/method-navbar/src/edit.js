/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls,
    MediaUpload
} from '@wordpress/block-editor';
import {
    PanelBody,
    PanelRow,
    ToggleControl,
    CustomSelectControl,
    Button,
    __experimentalUnitControl as UnitControl,
} from '@wordpress/components';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: 'method-navbar method-navbar-in-editor' });
    let extraClasses = '';
    if (attributes?.align === 'full') {
        extraClasses = ' is-layout-constrained wp-block-block has-global-padding';
    }
    let offcanvasHtml = navbarData.menuPreview;
    if (!!attributes.includeSocialNav) {
        offcanvasHtml = navbarData.menuPreview + '<ul class="method-sn">' + methodGlobalData.socialNavItems + '</ul>';
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title="Navbar Options" initialOpen={true}>
                    {!attributes.neverExpand && (
                        <PanelRow>
                            <div style={{ width: '100%', marginBottom: '24px' }}>
                                <CustomSelectControl
                                    label="Width to Expand Nav"
                                    options={methodGlobalData?.bsBreakpoints}
                                    showSelectedHint={true}
                                    value={methodGlobalData?.bsBreakpoints.find(opt => opt.key === attributes.expandAt)}
                                    onChange={(option) => setAttributes({ expandAt: option?.selectedItem?.key })}
                                />
                            </div>
                        </PanelRow>
                    )}
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '24px' }}>
                            <ToggleControl
                                label="Never Expand Navigation"
                                help="Enable this option if you would like to keep the nav menu hidden in an overlay menu."
                                checked={attributes.neverExpand}
                                onChange={(value) => setAttributes({ neverExpand: value })}
                            />
                        </div>
                    </PanelRow>
                    <PanelRow>
                        <div style={{ width: '100%', marginBottom: '24px' }}>
                            <ToggleControl
                                label="Include Social Nav"
                                help="Enable this option if you would like to display a social nav after the nav menu."
                                checked={attributes.includeSocialNav}
                                onChange={(value) => setAttributes({ includeSocialNav: value })}
                            />
                        </div>
                    </PanelRow>
                </PanelBody>
                <PanelBody title="Logo Options" initialOpen={false}>
                    <PanelRow>
                        <UnitControl
                            label="Logo Width"
                            value={attributes.responsiveSettings?.base?.logoWidth}
                            onChange={update('base', 'logoWidth')}
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <div className={`method-navbar-inner${extraClasses}`}>
                    <nav className='navbar navbar-expand-lg'>
                        <a className='navbar-brand'>
                            Logo
                        </a>
                        <button className='navbar-toggler'>
                            <span className='navbar-toggler-icon'></span>
                        </button>
                        <div className='offcanvas offcanvas-end' id='offcanvasNavbar'>
                            <div className='offcanvas-header'>
                                <h5 className='offcanvas-title' id='offcanvasNavbarLabel'>Navigation</h5>

                            </div>
                            <div className='offcanvas-body justify-content-end' dangerouslySetInnerHTML={{ __html: offcanvasHtml }}>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}