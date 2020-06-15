jQuery(function($) {
  tinyMCE.init({ mode: "textareas", theme: "modern" });
  let flatFields = [],
    obj = {},
    data = {};
  flatFields?.length < 1 &&
    Object.getOwnPropertyNames(LSP.api.defaults).forEach(function(field) {
      flatFields = flatFields.concat(
        Object.getOwnPropertyNames(LSP.api.defaults[field])
      );
    });

  $.ajax({
    method: "GET",
    url: LSP.api.settings,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("X-WP-Nonce", LSP.api.nonce);
    }
  }).then(function(r) {
    const description = tinyMCE.get("description");
    Object.keys(LSP.api.defaults).forEach(function(section) {
      if (r.hasOwnProperty(section)) {
        obj = Object.assign(obj, {
          [section]: {}
        });
        flatFields.forEach(function(field) {
          if (r[section].hasOwnProperty(field)) {
            $("#" + field).val(r[section][field]);
            $("#" + field + "_text").val(r[section][field]);
          }
        });
      }
    });
    description.setContent(r.site.description);
  });

  $("#lsp-form").on("submit", function(e) {
    e.preventDefault();
    const description = tinyMCE.get("description");
    Object.keys(LSP.api.defaults).forEach(function(section) {
      data = Object.assign(data, {
        [section]: {}
      });
      flatFields.forEach(function(field) {
        if (LSP.api.defaults[section].hasOwnProperty(field)) {
          const fieldVal = $("#" + field).val();
          data[section] = Object.assign(data[section], {
            [field]: $("#" + field).val(),
            title: $("#title").html(),
            tagline: $("#tagline").html()
          });
        }
      });
    });
    data.site.description = description.getContent();
    $.ajax({
      method: "POST",
      url: LSP.api.settings,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("X-WP-Nonce", LSP.api.nonce);
      },
      data: data
    }).then(function(r) {
      $("#feedback").html("<p>" + LSP.strings.saved + "</p>");
    }); /*.catch(function(e) {
      var message = LSP.strings.error;
      if(e.hasOwnProperty('message')) {
        message = e.message;
      }
      $('#feedback').html('<p>' + message + '</p>');
    })*/
  });
  $("#setDefault").click(function(e) {
    e.preventDefault();
    var youSure = window.confirm(
      "are you sure you want to revert to default colors?"
    );
    if (youSure) {
      $("#primary_color").val(LSP.api.defaults.colors.primary_color);
      $("#secondary_color").val(LSP.api.defaults.colors.secondary_color);
      $("#accent_color").val(LSP.api.defaults.colors.accent_color);
      $("#background_one").val(LSP.api.defaults.colors.background_one);
      $("#background_two").val(LSP.api.defaults.colors.background_two);
      $("#backdrop").val(LSP.api.defaults.colors.backdrop);
      $("#text_color").val(LSP.api.defaults.colors.text_color);
      $("#header_text_color").val(LSP.api.defaults.colors.header_text_color);
      $("#link_text_color").val(LSP.api.defaults.colors.link_text_color);
      $("#contrast_text_color").val(
        LSP.api.defaults.colors.contrast_text_color
      );
    }
  });
});

var __LSP_SETTINGS__ = {
  onChange: function(e) {
    e = e || window.event;
    document.getElementById(
      e.target.id
        .split("_")
        .slice(0, -1)
        .join("_")
    ).value = e.target.value;
  }
};

// (async function() {
//
//   const invokeApi = async ({ path, method = "GET", body }) => {
//     const headers = new Headers({
//       'X-WP-Nonce': LSP.api.nonce,
//       'Content-Type': 'application/json'
//     })
//     body = body ? JSON.stringify(body) : body
//     try {
//       const res = await fetch(path, { method, headers, body })
//       return await res.json()
//     } catch (e) {
//       throw new Error(e)
//     }
//   },
//   fields = ['street', 'city', 'state_province', 'postal_code', 'email'],
//   get = await invokeApi({ path: LSP.api['content-areas'] }),
//   _id = id => document.getElementById(id),
//   getVal = id => _id(id).value = get[id],
//   contentAreaForm = _id('lsp-form'),
//   feedback = _id('feedback')
//
//   fields.forEach(field => getVal(field))
//
//   contentAreaForm.addEventListener('submit', async e => {
//     e.preventDefault()
//     const bodidly = {
//       'street': _id('street').value,
//       'city': _id('city').value,
//       'state_province': _id('state_province').value,
//       'postal_code': _id('postal_code').value,
//       'email': _id('email').value
//     }
//     const res = await invokeApi({
//       path: LSP.api['content-areas'],
//       method: "POST",
//       body: bodidly
//     }).then(() => feedback.innerHTML = LSP.strings.saved)
//     id('feedback').html('<p>' + LSP.strings.saved + '</p>');
//   })
//
// })()
