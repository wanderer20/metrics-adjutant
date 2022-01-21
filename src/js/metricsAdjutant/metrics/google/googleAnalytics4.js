import GoogleGlobalTag from "./googleGlobalTag";

import { mergeDeep } from "../../utils/tools";

export default class GoogleAnalytics4 extends GoogleGlobalTag {
    constructor(props) {
        const defaultProps = {
            'type'      : 'google.analytics',
            'version'   : 'GA4',
            'vendor'    : 'google',
            'debug'     : false,
            'load'      : true,
            'options'   : {

            }
        }

        super(mergeDeep(defaultProps, props))
    }
}