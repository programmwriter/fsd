//Плагин dropdown NCS, изначально плагин был рассчитан для одного экземпляра на странице.
//Данная реализация  применяется к коллекци.
//Опции для каждого отдельно экзэмпляра беруться из атрибута Data

$(document).ready(function() {
  (function($) {
    $.fn.NCS = function(options) {
      //Конфигурация плагина по умолчани.
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

      //основная функция которая применяется к каждому элементу коллекции
      function main(elem) {
        $input = elem;
        $inputContainer = elem.parent();
        $originalPlaceholder = $input.attr("placeholder");

        //Опции из атрибута data-opts
        const options = $input.data().opts;

        //Мержим оции поумолчанию и оции из атрибута data-opt
        for (item in settings) {
          if (!options.hasOwnProperty(item)) {
            options[item] = settings[item];
          }
        }

        //Если не заданны значения поумолчанию, то заполняем массив значений нулями
        if (!options.categoryValues) {
          options.categoryValues = newFilledArray(
            options.categoryNames.length,
            0
          );
        }

        //создаем dom самого выпадающего списка
        $parent = createHTML();

        //если задаана опция закрытия выпадающего списка по клику снаружи блока
        if (options.closeOnOutsideClick) {
          $(document).mouseup(function(event) {
            $("input[name='NCS']").each(function() {
              $input = $(this);
              $parent = $input.next();
              if (
                !$input.is(event.target) &&
                !$parent.is(event.target) &&
                $parent.has(event.target).length === 0 &&
                !$("div.NCS.display").is(event.target) &&
                $("div.NCS.display").has(event.target).length === 0
              ) {
                if (options.fade) {
                  $parent.fadeOut(200);
                } else {
                  $parent.hide();
                }
                if ($input.hasClass("ncs_clicked")) {
                  $input.removeClass("ncs_clicked");
                }
              }
            });
          });
        }

        //открываем выпадающий список по клику на input, а так же делаем его активным
        $input.click(function() {
          switchSelector($(this));
          switchSelectorInput($(this));
        });

        //изменение положения выпадающего списка при ресайзе окна
        $(window).resize(function() {
          setPositions();
        });

        //инициализация колбэка
        function doCallback() {
          if (typeof options.callback == "function") {
            var callbackResult = {};
            for ($i = 0; $i < options.categoryNames.length; $i++) {
              callbackResult[options.categoryNames[$i]] =
                options.categoryValues[$i];
            }
            options.callback.call(this, callbackResult);
          }
        }

        //функция изменения позиции
        function setPositions() {
          switch (options.align) {
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
          if (options.useDisplay) {
            $display = $("div.NCS.display");
            $display.css("top", $input.position().top + 1);
            $display.css("left", $input.position().left + 1);
            $display.css("width", $input.width() - 1);
            $display.css("height", $input.height() - 1);
          }
        }
        //увеличение значения при нажатии на кнопку +
        $parent.find("a.NCS.button.plus").click(function(e) {
          e.preventDefault();
          $parent = $(e.target)
            .parent()
            .parent()
            .parent();
          $category = $(this).attr("category");
          if (options.categoryValues[$category] < options.maxValue) {
            options.categoryValues[$category]++;
            $num = options.categoryValues[$category];
            $parent
              .find("div.NCS.value[category='" + $category + "']")
              .text($num);
            doCallback();
            if (options.categoryValues[$category] == options.maxValue) {
              $(this).addClass("inactive");
            } else {
              $(this).removeClass("inactive");
            }
            if (options.categoryValues[$category] > options.minValue) {
              $parent
                .find("a.NCS.button.minus[category='" + $category + "']")
                .removeClass("inactive");
            } else {
              $parent
                .find("a.NCS.button.minus[category='" + $category + "']")
                .addClass("inactive");
            }
          }
          if (options.showText) {
            if (!options.useDisplay) {
              updateText($parent);
            } else {
              updateElement();
            }
          }
          return false;
        });

        //уменьшение значения при нажатии на кнопку -
        $parent.find("a.NCS.button.minus").click(function(e) {
          e.preventDefault();
          $parent = $(e.target)
            .parent()
            .parent()
            .parent();
          $category = $(this).attr("category");
          if (options.categoryValues[$category] > options.minValue) {
            options.categoryValues[$category]--;
            $num = options.categoryValues[$category];
            $parent
              .find("div.NCS.value[category='" + $category + "']")
              .text($num);
            doCallback();
            if (options.categoryValues[$category] == options.minValue) {
              $(this).addClass("inactive");
            } else {
              $(this).removeClass("inactive");
            }
            if (options.categoryValues[$category] < options.maxValue) {
              $parent
                .find("a.NCS.button.plus[category='" + $category + "']")
                .removeClass("inactive");
            } else {
              $parent
                .find("a.NCS.button.plus[category='" + $category + "']")
                .addClass("inactive");
            }
          }
          if (options.showText) {
            if (!options.useDisplay) {
              updateText($parent);
            } else {
              updateElement();
            }
          }
          return false;
        });

        //Очищаеть значения в dom дереве и делает кнопку - неактивной
        function clearValues(parent) {
          $values = parent.find("div.NCS.value").each(function() {
            $value = $(this);
            $value.text(options.categoryValues[$value.attr("category")]);
          });

          parent.find("a.NCS.button.minus").addClass("inactive");
        }

        function updateElement() {
          $input.val("");
          $display = $("div.NCS.inlinedisplay");
          $display.empty();
          $displayelements = 0;
          for ($i = 0; $i < options.categoryNames.length; $i++) {
            if (options.categoryValues[$i] != 0 || options.showZero) {
              $displayelement = $(
                "<div class='NCS displayelement'></div>"
              ).appendTo($display);
              $displayelement.text(
                options.categoryValues[$i] + " " + options.categoryNames[$i]
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

        //функция обновления знечений в инпуте
        function updateText(parent) {
          console.log(options.categoryValues);
          if (parent) {
            $input = $(parent).prev();
          }
          $text = "";
          $added = 0;
          if (options.clearAndCloseButtons) {
            let summValues = options.categoryValues.reduce(
              (acc, curr) => acc + curr
            );
            $text += summValues + " " + num2str(summValues, options.gradation);
          } else {
            for ($i = 0; $i < options.categoryNames.length; $i++) {
              if (options.categoryValues[$i] != 0 || options.showZero) {
                if ($added != 0) {
                  $text += options.delimiter;
                }
                $text +=
                  options.categoryValues[$i] +
                  " " +
                  num2str(
                    options.categoryValues[$i],
                    options.gradation[options.categoryNames[$i]]
                  );
                $added++;
              }
            }
          }

          $input.val($text);
        }

        //функция создания dom дерева выпадающего писка
        function createHTML() {
          $input.attr("type", "text");
          if (options.useDisplay) {
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

          $parent = $("<div class='NCS parent'></div>").appendTo(
            $input.parent()
          );
          $parent.css("top", $input.height() + 2);
          $parent.css("width", $input.innerWidth() + 2);
          $parent.hide();

          // switch (options.align) {
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

          for ($i = 0; $i < options.categoryNames.length; $i++) {
            $category = $("<div class='NCS category'></div>").appendTo($parent);
            $text = $("<div class='NCS text'></div>").appendTo($category);
            $name = $(
              "<div class='NCS name' category='" +
                $i +
                "'>&nbsp;" +
                options.categoryNames[$i] +
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
                options.categoryValues[$i] +
                "</div>"
            ).appendTo($buttons);
            $button_plus = $(
              "<a href='' class='NCS button plus' category='" +
                $i +
                "'>&#43;</a>"
            ).appendTo($buttons);

            if (options.categoryValues[$i] == options.maxValue) {
              $button_plus.addClass("inactive");
            }

            if (options.categoryValues[$i] == options.minValue) {
              $button_minus.addClass("inactive");
            }
          }
          if (options.clearAndCloseButtons) {
            $footer = $("<div class='NCS__footer'></div>").appendTo($parent);
            $clear = $("<a class='NCS__clear' href=''>очистить</a>").appendTo(
              $footer
            );
            $clear.click(function(e) {
              e.preventDefault();
              $parent = $(e.target)
                .parent()
                .parent();

              options.categoryValues = newFilledArray(
                options.categoryNames.length,
                0
              );
              updateText($parent);
              clearValues($parent);
              // $;
            });
            $confirm = $(
              "<a class='NCS__confirm' href=''>применить</a>"
            ).appendTo($footer);
            $confirm.click(function() {
              switchSelectorInput();
              if (options.fade) {
                $parent.fadeOut(200);
              } else {
                $parent.hide();
              }
              return false;
            });
          }

          if (options.showText) {
            if (!options.useDisplay) {
              updateText();
            } else {
              updateElement();
            }
          }

          if (options.useDisplay) {
            $input.css("color", "transparent");
          }

          return $parent;
        }

        //функция появления и скрытия выпадающего списка
        function switchSelector(input) {
          if (options.fade) {
            input.next().fadeToggle(200);
          } else {
            input.next().toggle();
          }
        }

        // пункция переключения инпута в активное или неактивное состояние
        function switchSelectorInput(input) {
          input.toggleClass("ncs_clicked");
        }
        //функция заполнения массива значений нулями
        function newFilledArray(len, val) {
          var rv = new Array(len);
          while (--len >= 0) {
            rv[len] = val;
          }
          return rv;
        }
      }

      //применение основной функции на все экземпляры коллекции
      this.each(function() {
        main($(this));
      });
      return this;
    };
  })(jQuery);

  //функции склонения значений в зависимости от количества
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

  //инициализация плагина на всю коллекцию Dropdown
  $("input[name='NCS']").NCS({
    categoryNames: ["взрослые", "дети", "младенцы"],
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
    gradation: ["гость", "гостя", "гостей"],
    callback: function(values) {}
  });
});
