import Home from './pages/Home.vue';

import HelloWorld from './demos/HelloWorld.vue';
import AnchorVue from './demos/Anchor.vue';
import AnimationVue from './demos/Animation.vue';
import AutoLayout from './demos/AutoLayout.vue';
import Boundary from './demos/Boundary.vue';
import Shape from './demos/Shape.vue';
import Clipboard from './demos/Clipboard.vue';
import CodecVue from './demos/Codec.vue';
import CollapseVue from './demos/Collapse.vue';
import ConstituentVue from './demos/Constituent.vue';
import ContexticonsVue from './demos/Contexticons.vue';
import ControlVue from './demos/Control.vue';
import DragsourceVue from './demos/Dragsource.vue';
import DropVue from './demos/Drop.vue';
import DynamicloadingVue from './demos/Dynamicloading.vue';
import EdgeToleranceVue from './demos/EdgeTolerance.vue';
import EditingVue from './demos/Editing.vue';
import WrappingVue from './demos/Wrapping.vue';
import WireVue from './demos/Wire.vue';
import WindowVue from './demos/Window.vue';
import VisibleVue from './demos/Visible.vue';
import ValidationVue from './demos/Validation.vue';
import UserObjectVue from './demos/UserObject.vue';
import UIConfigVue from './demos/UIConfig.vue';
import TreeVue from './demos/Tree.vue';
import ThreadVue from './demos/Thread.vue';
import TemplateVue from './demos/Template.vue';
import LayoutVue from './Layout.vue';
import EditorVue from './pages/editor/Editor.vue';
import SwimlanesVue from './demos/Swimlanes.vue';
import SheetstyleVue from './demos/Sheetstyle.vue';
import StencilsVue from './demos/Stencils.vue';
import ShowregionVue from './demos/Showregion.vue';
import SecondlabelVue from './demos/Secondlabel.vue';
import RadialtreeVue from './demos/Radialtree.vue';
import PortsVue from './demos/Ports.vue';
import DynamicStyleVue from './demos/DynamicStyle.vue';
import DynamicToobarVue from './demos/DynamicToobar.vue';

const demos = [
  AnchorVue,
  AnimationVue,
  AutoLayout,
  Boundary,
  Clipboard,
  CodecVue,
  CollapseVue,
  ConstituentVue,
  ContexticonsVue,
  ControlVue,
  DragsourceVue,
  DropVue,
  DynamicloadingVue,
  DynamicStyleVue,
  DynamicToobarVue,
  EdgeToleranceVue,
  EditingVue,
  PortsVue,
  RadialtreeVue,
  SecondlabelVue,
  ShowregionVue,
  StencilsVue,
  SheetstyleVue,
  SwimlanesVue,
  TemplateVue,
  ThreadVue,
  TreeVue,
  UIConfigVue,
  HelloWorld,
  UserObjectVue,
  ValidationVue,
  VisibleVue,
  WindowVue,
  WireVue,
  Shape,
  WrappingVue,
].map((item) => {
  let name = item.__file.split('/').pop().split('.')[0];
  return {
    name,
    path: `/demos/${name}`,
    component: item,
  };
});

export const routes = [
  { path: '/', component: Home, name: 'Home' },
  {
    path: '/demos',
    component: LayoutVue,
    children: [...demos],
  },
  {
    path: '/editor',
    component: EditorVue,
  },
];
