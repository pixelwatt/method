/* eslint-disable prettier/prettier */
import {
    useBlockProps
} from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes, clientId }) {
    const blockProps = useBlockProps({ className: 'method-breadcrumb-trail' }, {});
    return (
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
    );
}