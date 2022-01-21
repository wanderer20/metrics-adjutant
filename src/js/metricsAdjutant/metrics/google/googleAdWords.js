import GoogleGlobalTag from "./googleGlobalTag";

import { mergeDeep } from "../../utils/tools";

export default class GoogleAdWords extends GoogleGlobalTag {
    constructor(props) {
        const defaultProps = {
            'type'      : 'google.adwords',
            'version'   : 'AdWords',
            'vendor'    : 'google',
            'debug'     : false,
            'load'      : true,
            'options'   : {

            }
        }

        super(mergeDeep(defaultProps, props))
    }
}