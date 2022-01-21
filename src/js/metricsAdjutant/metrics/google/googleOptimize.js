import GoogleGlobalTag from "./googleGlobalTag";

import { mergeDeep } from "../../utils/tools";

export default class GoogleOptimize extends GoogleGlobalTag {
    constructor(props) {
        const defaultProps = {
            'type'      : 'google.optimize',
            'version'   : 'Optimize',
            'vendor'    : 'google',
            'debug'     : false,
            'load'      : true,
            'options'   : {

            }
        }

        super(mergeDeep(defaultProps, props))
    }
}