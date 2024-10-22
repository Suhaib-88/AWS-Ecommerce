import React, { useContext, useEffect } from 'react'
import AppRouter from './router';
import './App.css'

const App: React.FC = () => {
  // const {getCategories, getCart} = useContext(AppContext)

  // useEffect(() => {
  //   getCategories()
  //   getCart()
  // }, [getCategories, getCart])

  return (
    <div id= "app">
      <AppRouter />
    </div>
  )
}

export default App
