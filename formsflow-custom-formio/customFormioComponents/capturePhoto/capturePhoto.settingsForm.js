import baseEditForm from "formiojs/components/_classes/component/Component.form";

export default (...extend) => {

    return baseEditForm(
        [{
            label: 'Display',
            key: 'display',
            weight: 0,
            components: []
        },
        {
            label: 'Data',
            key: 'data',
            weight: 20,
            components: []
        },
        {
            label: 'Validation',
            key: 'validation',
            weight: 20,
            components: []
        }, {
            label: 'API',
            key: 'api',
            weight: 30,
            components: []
        }, {
            label: 'Logic',
            key: 'logic',
            weight: 50,
            components: []
        }, {
            label: 'Layout',
            key: 'layout',
            weight: 60,
            components: []
        }],
        ...extend
    );
};
