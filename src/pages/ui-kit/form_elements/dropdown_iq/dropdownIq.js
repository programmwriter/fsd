$(document).ready(() => {
  $(".iqdropdown").iqDropdown({
    // max total items
    maxItems: Infinity,
    // min total items
    minItems: 0,
    // text to show on the dropdown
    selectionText: "гость",
    // text to show for multiple items
    textPlural: "гостя",
    // buttons to increment/decrement
    controls: {
      position: "right",
      displayCls: "iqdropdown-item-display",
      controlsCls: "iqdropdown-item-controls",
      counterCls: "counter"
    },
    // fires when an item quantity changes
    onChange: (id, count, totalItems) => {
      console.log(id, count, totalItems);
    },
    // return false to prevent an item decrement
    beforeDecrement: (id, itemCount) => {
      console.log(id, itemCount);
      return true;
    },
    // return false to prevent an item increment
    beforeIncrement: (id, itemCount) => {
      console.log(id, itemCount);
      return true;
    }
  });
});
