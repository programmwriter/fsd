$(document).ready(function() {
  (function($) {
    $.fn.NCS = function(options) {
      $input = $(this);
      $originalPlaceholder = $input.attr("placeholder");

      var settings = $.extend(
        {
          // Defaults.
          categoryNames: ["Adults", "Children"],
          categoryValues: false,
          minValue: 0,
          maxValue: 10,
          closeOnOutsideClick: true,
          clearAndCloseButtons: false,
          showText: true,
          delimiter: ", ",
          align: "left",
          fade: true,
          useDisplay: true,
          showZero: false,
          gradation: {},
          callback: function(values) {}
        },
        options
      );

      if (!settings.categoryValues) {
        settings.categoryValues = newFilledArray(
          settings.categoryNames.length,
          0
        );
      }

      $parent = createHTML();

      if (settings.closeOnOutsideClick) {
        $(document).mouseup(function(e) {
          if (
            !$input.is(e.target) &&
            !$parent.is(e.target) &&
            $parent.has(e.target).length === 0 &&
            !$("div.NCS.display").is(e.target) &&
            $("div.NCS.display").has(e.target).length === 0
          ) {
            if (settings.fade) {
              $parent.fadeOut(200);
            } else {
              $parent.hide();
            }
            if ($input.hasClass("ncs_clicked")) {
              $input.removeClass("ncs_clicked");
            }
          }
        });
      }

      $(this).click(function() {
        switchSelector();
        switchSelectorInput();
        console.log($input.innerWidth());
      });

      $(window).resize(function() {
        setPositions();
      });

      function doCallback() {
        if (typeof options.callback == "function") {
          var callbackResult = {};
          for ($i = 0; $i < settings.categoryNames.length; $i++) {
            callbackResult[settings.categoryNames[$i]] =
              settings.categoryValues[$i];
          }
          options.callback.call(this, callbackResult);
        }
      }

      function setPositions() {
        switch (settings.align) {
          case "left":
            $parent.css(
              "top",
              $input.position().top + $input.outerHeight(true)
            );
            $parent.css("left", $input.position().left);
            break;
          case "right":
            $parent.css(
              "top",
              $input.position().top + $input.outerHeight(true)
            );
            $parent.css(
              "left",
              $input.position().left +
                $input.outerWidth(true) -
                $parent.outerWidth(true)
            );
            break;
          case "center":
            $parent.css(
              "top",
              $input.position().top + $input.outerHeight(true)
            );
            $parent.css(
              "left",
              $input.position().left +
                $input.outerWidth(true) / 2 -
                $parent.outerWidth(true) / 2
            );
            break;
        }
        if (settings.useDisplay) {
          $display = $("div.NCS.display");
          $display.css("top", $input.position().top + 1);
          $display.css("left", $input.position().left + 1);
          $display.css("width", $input.width() - 1);
          $display.css("height", $input.height() - 1);
        }
      }

      $("a.NCS.button.plus").click(function() {
        $category = $(this).attr("category");
        if (settings.categoryValues[$category] < settings.maxValue) {
          settings.categoryValues[$category]++;
          $num = settings.categoryValues[$category];
          $("div.NCS.value[category='" + $category + "']").text($num);
          doCallback();
          if (settings.categoryValues[$category] == settings.maxValue) {
            $(this).addClass("inactive");
          } else {
            $(this).removeClass("inactive");
          }
          if (settings.categoryValues[$category] > settings.minValue) {
            $("a.NCS.button.minus[category='" + $category + "']").removeClass(
              "inactive"
            );
          } else {
            $("a.NCS.button.minus[category='" + $category + "']").addClass(
              "inactive"
            );
          }
        }
        if (settings.showText) {
          if (!settings.useDisplay) {
            updateText();
          } else {
            updateElement();
          }
        }
        return false;
      });

      $("a.NCS.button.minus").click(function() {
        $category = $(this).attr("category");
        if (settings.categoryValues[$category] > settings.minValue) {
          settings.categoryValues[$category]--;
          $num = settings.categoryValues[$category];
          $("div.NCS.value[category='" + $category + "']").text($num);
          doCallback();
          if (settings.categoryValues[$category] == settings.minValue) {
            $(this).addClass("inactive");
          } else {
            $(this).removeClass("inactive");
          }
          if (settings.categoryValues[$category] < settings.maxValue) {
            $("a.NCS.button.plus[category='" + $category + "']").removeClass(
              "inactive"
            );
          } else {
            $("a.NCS.button.plus[category='" + $category + "']").addClass(
              "inactive"
            );
          }
        }
        if (settings.showText) {
          if (!settings.useDisplay) {
            updateText();
          } else {
            updateElement();
          }
        }
        return false;
      });

      function clearValues() {
        $values = $("div.NCS.value").each(function() {
          $value = $(this);
          $value.text(settings.categoryValues[$value.attr("category")]);
        });

        $("a.NCS.button.minus").addClass("inactive");
      }

      function updateElement() {
        $input.val("");
        $display = $("div.NCS.inlinedisplay");
        $display.empty();
        $displayelements = 0;
        for ($i = 0; $i < settings.categoryNames.length; $i++) {
          if (settings.categoryValues[$i] != 0 || settings.showZero) {
            $displayelement = $(
              "<div class='NCS displayelement'></div>"
            ).appendTo($display);
            $displayelement.text(
              settings.categoryValues[$i] + " " + settings.categoryNames[$i]
            );
            $displayelements++;
          }
        }
        if ($displayelements == 0) {
          $input.attr("placeholder", $originalPlaceholder);
        } else {
          $input.attr("placeholder", "");
        }
        updateText();
      }

      function updateText() {
        $text = "";
        $added = 0;
        if (settings.clearAndCloseButtons) {
          let summValues = settings.categoryValues.reduce(
            (acc, curr) => acc + curr
          );
          $text += summValues + " " + num2str(summValues, settings.gradation);
        } else {
          for ($i = 0; $i < settings.categoryNames.length; $i++) {
            if (settings.categoryValues[$i] != 0 || settings.showZero) {
              if ($added != 0) {
                $text += settings.delimiter;
              }
              $text +=
                settings.categoryValues[$i] +
                " " +
                num2str(
                  settings.categoryValues[$i],
                  settings.gradation[settings.categoryNames[$i]]
                );
              $added++;
            }
          }
        }

        $input.val($text);
      }

      function createHTML() {
        $input.attr("type", "text");
        if (settings.useDisplay) {
          $input.attr("placeholder", "");

          $display = $("<div class='NCS display'></div>").prependTo(
            $input.parent()
          );
          $display.css("top", $input.position().top + 1);
          $display.css("left", $input.position().left + 1);
          $display.css("width", $input.width() - 1);
          $display.css("height", $input.height() - 1);
          $("<div class='NCS inlinedisplay'></div>").appendTo($display);

          $display.click(function() {
            switchSelector();
          });
        }

        $parent = $("<div class='NCS parent'></div>").appendTo($input.parent());
        $parent.css("top", $input.height() + 2);
        $parent.css("width", $input.innerWidth() + 2);
        $parent.hide();

        // switch (settings.align) {
        //   case "left":
        //     $parent.css("top", $input.position().top + $input.outerHeight(true));
        //     $parent.css("left", $input.position().left);
        //     break;
        //   case "right":
        //     $parent.css("top", $input.position().top + $input.outerHeight(true));
        //     $parent.css(
        //       "left",
        //       $input.position().left +
        //         $input.outerWidth(true) -
        //         $parent.outerWidth(true)
        //     );
        //     break;
        //   case "center":
        //     $parent.css("top", $input.position().top + $input.outerHeight(true));
        //     $parent.css(
        //       "left",
        //       $input.position().left +
        //         $input.outerWidth(true) / 2 -
        //         $parent.outerWidth(true) / 2
        //     );
        //     break;
        // }

        for ($i = 0; $i < settings.categoryNames.length; $i++) {
          $category = $("<div class='NCS category'></div>").appendTo($parent);
          $text = $("<div class='NCS text'></div>").appendTo($category);
          $name = $(
            "<div class='NCS name' category='" +
              $i +
              "'>&nbsp;" +
              settings.categoryNames[$i] +
              "</div>"
          ).appendTo($text);
          $buttons = $("<div class='NCS buttons'></div>").appendTo($category);
          $button_minus = $(
            "<a href='' class='NCS button minus' category='" +
              $i +
              "'>&#8211;</a>"
          ).appendTo($buttons);
          $value = $(
            "<div class='NCS value' category='" +
              $i +
              "'>" +
              settings.categoryValues[$i] +
              "</div>"
          ).appendTo($buttons);
          $button_plus = $(
            "<a href='' class='NCS button plus' category='" + $i + "'>&#43;</a>"
          ).appendTo($buttons);

          if (settings.categoryValues[$i] == settings.maxValue) {
            $button_plus.addClass("inactive");
          }

          if (settings.categoryValues[$i] == settings.minValue) {
            $button_minus.addClass("inactive");
          }
        }
        if (settings.clearAndCloseButtons) {
          $footer = $("<div class='NCS__footer'></div>").appendTo($parent);
          $clear = $("<a class='NCS__clear' href=''>очистить</a>").appendTo(
            $footer
          );
          $clear.click(function(e) {
            e.preventDefault();
            settings.categoryValues = newFilledArray(
              settings.categoryNames.length,
              0
            );
            updateText();
            clearValues();
            $;
          });
          $confirm = $(
            "<a class='NCS__confirm' href=''>применить</a>"
          ).appendTo($footer);
          $confirm.click(function() {
            switchSelectorInput();
            if (settings.fade) {
              $parent.fadeOut(200);
            } else {
              $parent.hide();
            }
            return false;
          });
        }

        if (settings.showText) {
          if (!settings.useDisplay) {
            updateText();
          } else {
            updateElement();
          }
        }

        if (settings.useDisplay) {
          $input.css("color", "transparent");
        }

        return $parent;
      }

      function switchSelector() {
        if (settings.fade) {
          $parent.fadeToggle(200);
        } else {
          $parent.toggle();
        }
      }

      function switchSelectorInput() {
        $input.toggleClass("ncs_clicked");
      }

      function newFilledArray(len, val) {
        var rv = new Array(len);
        while (--len >= 0) {
          rv[len] = val;
        }
        return rv;
      }
    };
  })(jQuery);

  function num2str(n, text_forms) {
    n = Math.abs(n) % 100;
    var n1 = n % 10;

    if (n > 10 && n < 20) {
      return text_forms[2];
    }

    if (n1 > 1 && n1 < 5) {
      return text_forms[1];
    }

    if (n1 == 1) {
      return text_forms[0];
    }

    return text_forms[2];
  }

  $("input[name='NCS']").NCS({
    categoryNames: ["спальни", "кровати", "ванные комнаты"],
    categoryValues: [0, 0, 0],
    minValue: 0,
    maxValue: 10,
    closeOnOutsideClick: true,
    clearAndCloseButtons: true,
    showText: true,
    delimiter: ", ",
    align: "left",
    fade: false,
    useDisplay: false,
    showZero: true,
    gradation: ["комната", "комнаты", "комнат"],
    // gradation: {
    //   спальни: ["спальня", "спальни", "спален"],
    //   кровати: ["кровать", "кровати", "кроватей"],
    //   "ванные комнаты": ["ванная комната", "ванные комнаты", "ванных комнат"]
    // },
    callback: function(values) {}
  });
});
