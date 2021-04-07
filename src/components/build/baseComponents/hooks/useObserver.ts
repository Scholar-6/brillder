import React from "react";
import * as Y from "yjs";

import { toRenderJSON } from "services/SharedTypeService";
import _ from "lodash";

export const useObserver = <T extends Y.AbstractType<any>>(obj: T, property?: string) => {
    const initialValue = property ? toRenderJSON((obj as unknown as Y.Map<any>).get(property)) : toRenderJSON(obj);
    const [value, setValue] = React.useState<any>(initialValue);

    const observer = React.useCallback(_.throttle(() => {
        const v = property ? toRenderJSON((obj as unknown as Y.Map<any>).get(property)) : toRenderJSON(obj);
        setValue(v);
    }, 200), [obj]);

    React.useEffect(() => {
        obj.observeDeep(observer);
        return () => obj.unobserveDeep(observer);
    }, [obj]);

    return value;
}