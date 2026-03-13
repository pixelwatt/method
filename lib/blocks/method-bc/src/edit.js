/* eslint-disable prettier/prettier */
import {
    useBlockProps,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody
} from '@wordpress/components';
import MethodResponsiveTabs from '../../components/MethodResponsive';
import MethodSpacingControls from '../../components/MethodSpacingControls';
import MethodStyleTag from '../../components/MethodStyleTag';
import MethodAlignmentControls from '../../components/MethodAlignmentControls';
import MethodColorControls from '../../components/MethodColorControls';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: 'method-breadcrumb-trail' }, {});
    const cssMap = {
        [`#block-${clientId}`]: [
            'margin-top',
            'margin-bottom',
            'textColor'
        ],
        [`#block-${clientId} a`]: [
            'linkColor'
        ],
        [`#block-${clientId} > .method-breadcrumb-list`]: ['gap', 'justifyContent', 'alignItems', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',],
        [`#block-${clientId} > .method-breadcrumb-list .method-breadcrumb-item`]: ['gap'],
        [`#block-${clientId} > .method-breadcrumb-list .method-breadcrumb-item:last-of-type`]: ['linkColor'],
    };
    return (
        <>
            <InspectorControls>
                <MethodAlignmentControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['alignItems', 'justifyContent']}
                />
                <MethodSpacingControls
                    breakpoint="base"
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['padding', 'margin', 'gap']}
                    sides={{
                        padding: ['top', 'bottom', 'left', 'right'],
                        margin: ['top', 'bottom'],
                        gap: ['horizontal', 'vertical'],
                    }}
                />
                <MethodColorControls
                    attributes={attributes}
                    setAttributes={setAttributes}
                    include={['textColor', 'linkColor']}
                />
                <MethodResponsiveTabs
                    attributes={attributes}
                    setAttributes={setAttributes}
                    renderControls={{
                        mobile: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent']}
                                />
                                <MethodSpacingControls
                                    breakpoint="mobile"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                        tablet: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent']}
                                />
                                <MethodSpacingControls
                                    breakpoint="tablet"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                        wide: (
                            <>
                                <MethodAlignmentControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['alignItems', 'justifyContent']}
                                />
                                <MethodSpacingControls
                                    breakpoint="wide"
                                    attributes={attributes}
                                    setAttributes={setAttributes}
                                    include={['padding', 'margin', 'gap']}
                                    sides={{
                                        padding: ['top', 'bottom', 'left', 'right'],
                                        margin: ['top', 'bottom'],
                                        gap: ['horizontal', 'vertical'],
                                    }}
                                />
                            </>
                        ),
                    }}
                />
            </InspectorControls>
            <div {...blockProps}>
                <ol className="method-breadcrumb-list">
                    <li className="method-breadcrumb-item">
                        <a>Item</a>
                        <span className="method-breadcrumb-sep" aria-hidden="true">/</span>
                    </li>
                    <li className="method-breadcrumb-item">
                        <a>Item</a>
                        <span className="method-breadcrumb-sep" aria-hidden="true">/</span>
                    </li>
                    <li className="method-breadcrumb-item">
                        <a>Item</a>
                    </li>
                </ol>
            </div>
            <MethodStyleTag
                clientId={clientId}
                attributes={attributes}
                selectorMap={cssMap}
            />
        </>
    );
}