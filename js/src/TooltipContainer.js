/** TooltipContainer */

var utils = require('./utils');
var PlacedDiv = require('./PlacedDiv');
var tinier = require('tinier')


var TooltipContainer = utils.make_class();
// instance methods
TooltipContainer.prototype = {
  init: init,
  setup_map_callbacks: setup_map_callbacks,
  setup_zoom_callbacks: setup_zoom_callbacks,
  is_visible: is_visible,
  show: show,
  hide: hide,
};
module.exports = TooltipContainer;


// definitions
function init(selection, map, tooltip_component, zoom_container) {
  var div = selection.append('div')
        .attr('id', 'tooltip-container')
  this.placed_div = PlacedDiv(div, map)
  this.placed_div.hide()

  this.map = map
  this.setup_map_callbacks(map)
  this.zoom_container = zoom_container
  this.setup_zoom_callbacks(zoom_container)

  // keep a reference to tinier tooltip
  var initialState = {
    isVisible: false,
    bigg_id: null,
    name: null,
    loc: null,
  }
  this.tinier_tooltip = tinier.run(tooltip_component, div.node(),
                                   { initialState: initialState })
}

function setup_map_callbacks(map) {
  map.callback_manager.set('show_tooltip.tooltip_container',
                           this.show.bind(this))
  map.callback_manager.set('hide_tooltip.tooltip_container',
                           this.hide.bind(this))
}

function setup_zoom_callbacks(zoom_container) {
  zoom_container.callback_manager.set('zoom.tooltip_container', function() {
  }.bind(this));
  zoom_container.callback_manager.set('go_to.tooltip_container', function() {
  }.bind(this));
}

/**
 * Return visibility of tooltip container.
 * @return {Boolean} Whether tooltip is visible.
 */
function is_visible() {
  return this.placed_div.is_visible()
}

/**
 * Show and place the input.
 */
function show(type, d) {
  if (type === 'reaction_label') {
    var coords = { x: d.label_x, y: d.label_y }
    this.placed_div.place(coords)
    var new_state = {
      bigg_id: d.bigg_id,
      name: d.name,
      loc: coords,
    }
    this.tinier_tooltip.setState(new_state)
  } else {
    throw new Error('Tooltip not supported for object type ' + type)
  }
}

/**
 * Hide the input.
 */
function hide() {
  this.placed_div.hide()
  this.tinier_tooltip.signals.didHide.call()
}
