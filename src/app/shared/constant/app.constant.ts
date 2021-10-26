export class AppConstant {
    public static readonly REMEMBER_LAST_WORKAREA = false;

    public static get API_BASE(): string {
        return "http://localhost:56633/api/v1";
    }

    public static get TOKEN_URL(): string {
        return "http://localhost:56633/token";
    }

    public static get API_VERSION(): boolean {
        return true;
    }

    public static EMAIL_REGEXP(): RegExp {
        return /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    }

    public static ObjectsToParams(obj): string {
        const p = [];
        for (const key in obj) {
            if (key != null) {
                p.push(key + "=" + encodeURIComponent(obj[key]));
            }
        }
        return p.join("&");
    }

    public static ToNumberFormate(value): string {
        return value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
    private static regularExpression(pamount: any) {
        return {
            __return: pamount = pamount.replace(/[^0-9-.]/g, ""),
            pamount
        };
    }
}
