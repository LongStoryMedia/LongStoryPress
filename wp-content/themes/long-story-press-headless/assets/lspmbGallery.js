jQuery(function($) {
  var meta_gallery_frame;
  var elID = LSP.mb_state.id + "_gallery";
  var currentIDs;
  var listEl = L$.id(LSP.mb_state.id + "_gallery_list");
  var cleanIDstring = function(string) {
    return string.replace(/(^,|,{2,}|,$)/g, "");
  };
  var ulFrag;
  L$.id(elID).value = cleanIDstring(L$.id(elID).value);
  L$.addListener(
    L$.cl(LSP.mb_state.id + "_select"),
    "change",
    function(e) {
      e.target.value = e.target.options[e.target.selectedIndex].value;
    },
    true
  );
  L$.addListener(L$.id(elID + "_button"), "click", function(e) {
    e.preventDefault();
    if (meta_gallery_frame) {
      meta_gallery_frame.open();
      return;
    }
    meta_gallery_frame = wp.media.frames.meta_gallery_frame = wp.media({
      title: [LSP.mb_state.id].title,
      button: { text: [LSP.mb_state.id].button },
      library: { type: "image" },
      multiple: true
    });
    meta_gallery_frame.states.add([
      new wp.media.controller.Library({
        id: LSP.mb_state.id,
        title: "Select Images for Gallery",
        priority: 20,
        toolbar: "main-gallery",
        filterable: "uploaded",
        library: wp.media.query(meta_gallery_frame.options.library),
        multiple: meta_gallery_frame.options.multiple ? "reset" : false,
        editable: true,
        allowLocalEdits: true,
        displaySettings: true,
        displayUserSettings: true
      })
    ]);
    meta_gallery_frame.on("open", function() {
      var selection = meta_gallery_frame.state().get("selection");
      var library = meta_gallery_frame.state("gallery-edit").get("library");
      var ids = cleanIDstring(L$.id(elID).value);
      if (ids) {
        idsArray = ids.split(",");
        currentIDs = ids.split(",");
        idsArray.forEach(function(id) {
          var attachment = wp.media.attachment(id);
          attachment.fetch();
          selection.add(attachment ? [attachment] : []);
        });
      } else {
        currentIDs = [];
      }
    });
    meta_gallery_frame.on("ready", function() {
      $(".media-modal").addClass("no-sidebar");
    });

    meta_gallery_frame.on("select", function() {
      var selection = meta_gallery_frame.state().get("selection");
      var metadataString = "";
      var addToList = function(model) {
        currentIDs.push(model.id.toString());
      };
      images = meta_gallery_frame.state().get("selection");
      images.models.forEach(function(model) {
        if (currentIDs) {
          if (!currentIDs.includes(model.id.toString())) {
            addToList(model);
          }
        } else {
          currentIDs = [].push(model.id.toString());
        }
      });
      metadataString = htmlFromIDs(currentIDs);
      if (metadataString) {
        closeEvt();
      }
    });
    meta_gallery_frame.open();
  });
  function htmlFromIDs(idArr) {
    var ids = [];
    idArr.map(function(id) {
      var attachment = wp.media.attachment(id);
      listEl.innerHTML = "";
      return attachment
        .fetch()
        .then(function(att) {
          var imgURL = att.sizes
            ? att.sizes.thumbnail
              ? att.sizes.thumbnail
              : att.url
            : att.url;
          var li = L$.el("li");
          var div = L$.el("div");
          var span = L$.el("span");
          var img = L$.el("img");
          div.className = LSP.mb_state.id + "_gallery_container";
          span.className = LSP.mb_state.id + "_gallery_close";
          img.id = att.id;
          img.src = imgURL;
          div.appendChild(span);
          div.appendChild(img);
          li.appendChild(div);
          ids.push(id);
          listEl.appendChild(li);
          L$.id(elID).value = ids.join(",");
        })
        .then(function() {
          closeEvt();
        });
    });
  }
  function closeEvt() {
    L$.addListener(
      L$.cl(LSP.mb_state.id + "_gallery_close"),
      "click",
      function(e) {
        e.preventDefault();
        if (confirm("Are you sure you want to remove this image?")) {
          L$.id(elID).value = L$.id(elID)
            .value.split(",")
            .filter(function(id) {
              return id !== e.target.nextElementSibling.id;
            })
            .join(",");
          htmlFromIDs(L$.id(elID).value.split(","));
        }
      },
      true
    );
  }
  closeEvt();
});
