$("#tabs").tabs({});

$("#dialog").dialog({ autoOpen: false, modal: true });

$(".button").button();

$(document).tooltip({
  classes: {
    "ui-tooltip": "highlight ui-corner-all ui-widget-shadow",
  },
});

$(".slider").on("click", () => {
  let lastLink = $("head > link").last()[0];
  if (lastLink.getAttribute("href") !== "css/jquery-ui.theme.min.css") {
    $("head").append("<link rel=stylesheet href=css/jquery-ui.theme.min.css>");
  } else {
    $("head > link").last().remove();
  }
});
