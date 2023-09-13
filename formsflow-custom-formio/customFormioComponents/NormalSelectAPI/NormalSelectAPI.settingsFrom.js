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
      components: [
        {
          type: 'textfield',
          label: 'Request Url',
          key: 'requestUrl',
          input: true,
          inline: true,
          validate: {
            required: true
          }
        },
        {
          type: 'textfield',
          label: 'Data Path',
          key: 'dataPath',
          input: true,
          inline: true,
        },
        {
          type: 'editgrid',
          label: 'Labels Name',
          key: 'labelsName',
          components: [
            {
              type: 'textfield',
              label: 'Label Name',
              key: 'gridLabelName',
              input: true,
              inline: true,
              validate: {
                required: true
              }
            },
          ]

        },
        {
          type: 'textfield',
          label: 'Label Name',
          key: 'labelName',
          input: true,
          inline: true,
          validate: {
            required: true
          }

        },
        {
          type: 'textfield',
          label: 'Value Name',
          key: 'valueName',
          input: true,
          inline: true,
          validate: {
            required: true
          }

        },
        
        {
          type: 'editgrid',
          label: 'Components To fill',
          key: 'componentsToFill',
          components: [
            {
              type: 'textfield',
              label: 'Field API',
              key: 'fieldApi',
              input: true,
              inline: true,
              validate: {
                required: true
              }
            },
          ]

        },
      ],
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
