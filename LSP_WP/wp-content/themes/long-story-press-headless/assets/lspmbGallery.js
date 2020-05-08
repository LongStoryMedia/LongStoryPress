(function() {
  var meta_gallery_frame;
  var elID = LSP.mb_state.id + "_gallery";
  var currentIDs;
  var listEl = L$.id(LSP.mb_state.id + "_gallery_list");
  var imgs = L$.cl(elID + "_container");
  var captions = L$.cl(LSP.mb_state.id + "_caption");
  var links = L$.cl(LSP.mb_state.id + "_link");
  var targets = L$.cl(LSP.mb_state.id + "_target");
  var cleanIDstring = function(string) {
    var removeEmpties = string.replace(/(^,|,{2,}|,$)/g, "");
    var list = removeEmpties.split(",");
    var imgIds = [];
    for (var i = 0; i < imgs.length; i++) {
      var imgId = Array.from(L$.kids(imgs[i])).filter(el =>
        Number.isInteger(parseInt(el.id, 10))
      );
      imgId && imgIds.push(imgId[0].id);
      captions[i]
        ? imgIds.push(encodeURIComponent(captions[i].value))
        : imgIds.push("");
      links[i]
        ? imgIds.push(encodeURIComponent(links[i].value))
        : imgIds.push("");
      targets[i] && targets[i].checked
        ? imgIds.push(targets[i].value)
        : imgIds.push("");
    }
    return imgIds.join(",");
  };
  var ulFrag;
  var setImgInputValue = function() {
    L$.id(elID).value = cleanIDstring(L$.id(elID).value);
  };
  setImgInputValue();
  mediaListener();
  L$.addListener(
    L$.cl(LSP.mb_state.id + "_select"),
    "change",
    function(e) {
      e.target.value = e.target.options[e.target.selectedIndex].value;
    },
    true,
    { passive: true, once: true, capture: true },
    true
  );
  L$.addListener(
    L$.id(elID + "_button"),
    "click",
    function(e) {
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
        L$.cl("media-modal")[0].classList.toggle("no-sidebar");
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
    },
    false,
    { passive: true, once: true, capture: true },
    true
  );
  function mediaListener() {
    return L$.addListener(
      [captions, links, targets],
      "change",
      setImgInputValue,
      true,
      { passive: true, capture: true },
      true
    );
  }
  function htmlFromIDs(idArr) {
    var ids = [];
    idArr.map(function(id) {
      var attachment = wp.media.attachment(id);
      listEl.innerHTML = "";
      return attachment
        .fetch()
        .then(function(n) {
          var imgURL = n.sizes
            ? n.sizes.thumbnail
              ? n.sizes.thumbnail.url
              : n.url
            : n.url;
          var li = L$.el("li");
          var div = L$.el("div");
          var span = L$.el("span");
          var img = L$.el("img");
          var inputCaption = L$.el("input");
          var inputLink = L$.el("input");
          var inputTarget = L$.el("input");
          var labelCaption = L$.el("label");
          var labelLink = L$.el("label");
          var labelTarget = L$.el("label");
          div.className = LSP.mb_state.id + "_gallery_container";
          span.className = LSP.mb_state.id + "_gallery_close";
          img.id = n.id;
          img.src = imgURL;
          labelCaption.for = LSP.mb_state.id + "_caption_" + id;
          labelLink.for = LSP.mb_state.id + "_link_" + id;
          labelTarget.for = LSP.mb_state.id + "_target_" + id;
          labelCaption.innerText = "Image Caption";
          labelLink.innerText = "Image Link";
          labelTarget.innerText = "Open in new tab?";
          inputCaption.type = "text";
          inputCaption.id = LSP.mb_state.id + "_caption_" + id;
          inputCaption.className = LSP.mb_state.id + "_caption widefat";
          inputCaption.placeholder = "caption";
          inputLink.type = "text";
          inputLink.id = LSP.mb_state.id + "_link_" + id;
          inputLink.className = LSP.mb_state.id + "_link widefat";
          inputLink.placeholder = "link";
          inputTarget.type = "checkbox";
          inputTarget.id = LSP.mb_state.id + "_target_" + id;
          inputTarget.className = LSP.mb_state.id + "_target widefat";
          inputTarget.value = "target";
          div.appendChild(span);
          div.appendChild(img);
          li.appendChild(div);
          li.appendChild(labelCaption);
          li.appendChild(inputCaption);
          li.appendChild(labelLink);
          li.appendChild(inputLink);
          li.appendChild(labelTarget);
          li.appendChild(inputTarget);
          ids.push(id);
          listEl.appendChild(li);
          setImgInputValue();
          mediaListener();
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
          var idArr = cleanIDstring(L$.id(elID).value).split(",");
          console.log(
              e.target.nextElementSibling.id,
              idArr[idArr.indexOf(e.target.nextElementSibling.id) + 3],
              idArr[idArr.indexOf(e.target.nextElementSibling.id) + 2],
              idArr[idArr.indexOf(e.target.nextElementSibling.id) + 1])
          L$.id(elID).value = idArr
            .map(function(str) {
              if(str !== e.target.nextElementSibling.id &&
              str !== idArr[idArr.indexOf(e.target.nextElementSibling.id) + 3] &&
              str !== idArr[idArr.indexOf(e.target.nextElementSibling.id) + 2] &&
              str !== idArr[idArr.indexOf(e.target.nextElementSibling.id) + 1])
              return str
            })
            .join(",");
          htmlFromIDs(L$.id(elID).value.split(","));
        }
      },
      true,
      { passive: true, once: true, capture: true },
      true
    );
  }
  closeEvt();
})();
