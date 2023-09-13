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
          key: 'companyRequestUrl',
          input: true,
          inline: true,
          validate: {
            required : true
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
          label: 'Fields',
          key: 'companyGrid',
          templates: {
            "header": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">{{ t(component.label) }}</div>\n        {% } %}\n      {% }) %}\n    </div>",
            "tableHeader": "\n      <tr>\n        {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">{{ component.label }}</td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">Actions</td>\n        {% } %}\n      </tr>\n    ",
            "row": "<div class=\"row\">\n      {% util.eachComponent(components, function(component) { %}\n        {% if (displayValue(component)) { %}\n          <div class=\"col-sm-4\">\n            {{ isVisibleInRow(component) ? getView(component, row[component.key]) : ''}}\n          </div>\n        {% } %}\n      {% }) %}\n      {% if (!instance.options.readOnly && !instance.disabled) { %}\n        <div class=\"col-sm-4\">\n          <div class=\"btn-group pull-right\">\n            <button class=\"btn btn-default btn-light btn-sm editRow\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n            {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n            {% } %}\n          </div>\n        </div>\n      {% } %}\n    </div>",
            "tableRow": "\n      {% util.eachComponent(components, function(component) { %}\n          {% if (!component.hasOwnProperty('tableView') || component.tableView) { %}\n            <td class=\"editgrid-table-column\">\n              {{ getView(component, row[component.key]) }}\n            </td>\n          {% } %}\n        {% }) %}\n        {% if (!instance.options.readOnly && !instance.disabled) { %}\n          <td class=\"editgrid-table-column\">\n            <div class=\"btn-group\">\n              <button class=\"btn btn-default btn-light btn-sm editRow\" aria-label=\"{{ t('Edit row') }}\"><i class=\"{{ iconClass('edit') }}\"></i></button>\n              {% if (!instance.hasRemoveButtons || instance.hasRemoveButtons()) { %}\n              <button class=\"btn btn-danger btn-sm removeRow\" aria-label=\"{{ t('Remove row') }}\"><i class=\"{{ iconClass('trash') }}\"></i></button>\n              {% } %}\n            </div>\n          </td>\n        {% } %}\n    ",
            "footer": ""
        },
          input: true,
          inline: true,
          components: [
            {
              type: 'columns',
              label: 'Data',
              key: 'columns',
              input: true,
              inline: true,
              columns: [


                {
                  currentWidth: 6,
                  width: 6,
                  components: [
                    {
                      type: 'textfield',
                      label: 'Field Path',
                      key: 'companyFieldPath',
                      input: true,
                      inline: true,
                      validate: {
                        required : true
                      }
                    },
                  ]
                },

                {
                  currentWidth: 6,
                  width: 6,
                  components: [
                    {
                      type: 'textfield',
                      label: 'Field Name',
                      key: 'companyFieldName',
                      input: true,
                      inline: true,
                      validate: {
                        required : true
                      }
                    },
                  ]
                }
              ]
            },
          ]
        },
      ]
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
