import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { ThWindow } from './components/ThWindow'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>tgraph</h1>
      <ThWindow title="test">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit asperiores expedita error ex? Iusto autem, quidem consectetur culpa reiciendis, delectus eos obcaecati error esse fugit sed ad voluptatem hic fugiat?
      </ThWindow>
    </div>
  )
}

export default App
