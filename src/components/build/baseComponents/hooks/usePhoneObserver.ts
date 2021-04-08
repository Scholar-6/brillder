import React from "react";
import * as Y from "yjs";
import _ from "lodash";

import { toRenderJSON } from "services/SharedTypeService";

export const usePhoneObserver = (obj: Y.Map<any>, timeout: number = 200) => {
    const initialValue = toRenderJSON(obj);
    const [value, setValue] = React.useState(initialValue);

    const observer = React.useCallback(_.throttle(() => {
        const v = toRenderJSON(obj);
        setValue(v);
    }, timeout), [obj]);

    React.useEffect(() => {
        const updatedValue = toRenderJSON(obj);
        setValue(updatedValue);
        obj.observeDeep(observer);
        return () => obj.unobserveDeep(observer);
    }, [obj]);

    return value;
}