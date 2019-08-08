import "paginationjs";

$(function() {
  function createPaginator(name) {
    var container = $("#pagination-" + name);
    var sources = (function() {
      var result = [];
      for (var i = 1; i < 146; i++) {
        result.push(i);
      }
      return result;
    })();
    var options = {
      dataSource: sources,
      pageRange: 1,
      autoHidePrevious: true,
      prevText: "",
      nextText: "",
      // autoHideNext: true,
      callback: function(response, pagination) {
        window.console && console.log(response, pagination);
        var dataHtml = "<ul>";
        $.each(response, function(index, item) {
          dataHtml += "<li>" + item + "</li>";
        });
        dataHtml += "</ul>";
        container.prev().html(dataHtml);
      }
    };
    container.addHook("beforeInit", function() {
      window.console && console.log("beforeInit...");
    });
    container.pagination(options);
    container.addHook("beforePageOnClick", function() {
      window.console && console.log("beforePageOnClick...");
    });
    return container;
  }
  createPaginator("box");
});
