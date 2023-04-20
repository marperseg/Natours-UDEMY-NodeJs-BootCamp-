/* eslint-disable */
// import Stripe from 'stripe';
import axios from 'axios';
import { showAlert } from './alerts';

// const stripe = Stripe(
//   'pk_test_51MyZzIGjSRTBut7jpws6K5Fst8PaeLZSZs5i3e9AUomdkvTcltu8ceve5rSF6NPgfVQRDf99LjssNiWszo1HVClY00zbdSSaj0'
// );

export const bookTour = async (tourId) => {
  //1) Get session from server
  try {
    console.log('bookTour', tourId);
    const session = await axios(
      `http://localhost:8468/api/v1/bookings/checkout-session/${tourId}`
    );

    // TEMP SOLUTION
    console.log(
      'SESSION.....',
      session.data,
      session.data.tour._id,
      session.data.user._id,
      session.data.tour.price
    );

    showAlert('error', 'Feature not implemented yet, redirecting...');
    window.setTimeout(() => {
      location.assign(
        `http://localhost:8468/?tour=${session.data.tour._id}&user=${session.data.user._id}&price=${session.data.tour.price}`
      );
    }, 1200);

    //2) Create checkout form + charge credit card
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id,
    // });
  } catch (err) {
    console.log(err);
    showAlert('error', 'Feature not implemented...');
  }
};
