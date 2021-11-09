$(document).ready(function () {
  const $mainPage = $(".main-page");
  const $expandButton = $(".bottombar-expand-button");
  const $bottomBar = $(".bottombar");
  $expandButton.on("click", function () {
    if ($bottomBar.hasClass("bottombar-expanded")) {
      $bottomBar.removeClass("bottombar-expanded");
      $mainPage.css("overflow", "auto");
    } else {
      $bottomBar.addClass("bottombar-expanded");
      $mainPage.css("overflow", "hidden");
    }
  });
  console.debug($expandButton);
});
