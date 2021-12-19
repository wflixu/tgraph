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
  Shape,
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



