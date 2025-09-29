import type { IStaticMethods } from "flyonui/flyonui";

declare global {
    interface Window {
        _: typeof import("lodash");
        $: typeof import("jquery");
        jQuery: typeof import("jquery");
        DataTable: any;
        Dropzone: any;
        noUiSlider: typeof import("nouislider");

        HSStaticMethods: IStaticMethods;
    }
}

export {};
