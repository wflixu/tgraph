import HelloWorld from './demos/HelloWorld.vue';
import Home from './components/Home.vue';
import DemoAnchor from './demos/DemoAnchor.vue';
import DemoAnimation from './demos/DemoAnimation.vue'; 
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
const demos = [
  HelloWorld,
  DemoAnchor,
  DemoAnimation,
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
  EdgeToleranceVue,
  EditingVue,
  UserObjectVue,
  ValidationVue,
  VisibleVue,
  WindowVue,
  WireVue,
  Shape,
  WrappingVue,
].map(item=>{
  let name = item.__file.split('\/').pop().split('.')[0];
  return {
    name,
    path:`/${name}`,
    component:item,
  }
});

export const routes = [
  { path: '/', component: Home, name: 'Home' },
  ...demos
];



