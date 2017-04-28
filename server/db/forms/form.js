const mongoose = require('mongoose');


class ModelForm {
  constructor(schema) {
    this.schema = schema;
    this.obj = Object.keys(schema.obj);
    this.paths = schema.paths;

    this.widgets = {
      "String": {
        el: 'input',
        type: 'text'
      },
      "Currency": {
        el: 'input',
        type: 'number',
        step: 1,
        detail: 'currency'
      },
      "ObjectID": {
        el: 'select',
      },
      "Boolean": {
        el: 'input',
        type: 'checkbox'
      },
      "Url": {
        el: 'input',
        type: 'text',
        detail: 'url'
      }

    };
    this.buildForm();
  }

  buildForm() {
    this.form = this.obj.map((field, idx) => {
      const {instance} = this.paths[field];
      if (instance === "ObjectID") {
        return {
          widget: this.widgets[instance],
          name: field,
          helpText: this.paths[field].options.helpText,
          ref: this.getReference(this.paths[field]),
          options: this.buildSelectOptions(this.paths[field]).then(docs => {
            this.form[idx].options = docs;
          })
        };
      } else {
        return {
          widget: this.paths[field].options.widget || this.widgets[instance],
          helpText: this.paths[field].options.helpText,
          name: field,
        };
      }
    });
  }

  getReference(field) {
    const {ref} = field.options;
    return ref;
  }

  buildSelectOptions(field) {
    const {ref} = field.options;
    const schema = mongoose.model(ref);
    return schema.find({}).sort({name:1});
  }
}

module.exports = ModelForm;
