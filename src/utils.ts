export function parse_props(values: string | Array<string>): Map<string, Array<string>> {
    let map = new Map<string, Array<string>>();
    switch (typeof values) {
        case "string":
            const pair = values.split(":")
            map.set(pair[0], [pair[1]])
            break;
    
        default:
            values.forEach(value => {
                const pair = value.split(":");
                let values_pointer = map.get(pair[0]);
                if (values_pointer === undefined) {
                    map.set(pair[0], [pair[1]])
                } else {
                    values_pointer.push(pair[1])
                }
            })
            break;
    }
    return map;
}
