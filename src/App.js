import React, {useState, useRef, useEffect} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [paidFor, setPaidFor] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();

  const product = {
    price: 777.77,
    descprition: 'Fancy product',
  }

  useEffect(() => {
    //Load Paypal Script
    const token = getToken();
    console.log('token', token)
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AfzkpUUZlb1sJp3xm8KB1OMjaMzEXZyjr-OepcMGWzmiWsT2m9xugkFkBrXMcbZ9R8a-Cc03qi1is96z";
    script.addEventListener('load', () => setLoaded(true));
    document.body.appendChild(script);

    if (loaded) {
      setTimeout(() => {
        window.paypal.Buttons({
          createOrder: (data, action) => {
            return action.order.creat({
              purchase_units: [
                {
                  description: product.description,
                  amount: {
                    currency_code: "USD",
                    value: product.price,
                  }
                }
              ]
            })
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            setPaidFor(true);
            console.log(order)
          }
        }).render(paypalRef)
      })
    }
  })

  const getToken = async () => {
    const token = await axios.get('http://localhost:3000/my-api/client-token').then(response => console.log(response)).catch(e => console.log(e));
    return token  
  }
  
  return (
    <div className="App">
     {
       paidFor ? (
         <div>
           <h1>Congrats, you just baught the product</h1>
         </div>
       ) : (
         <div>
           <h1>
             {product.descprition} for ${product.price}
           </h1>
           <div ref={v => (paypalRef = v)} />
         </div>
       )
     }
    </div>
  )
}

export default App;
