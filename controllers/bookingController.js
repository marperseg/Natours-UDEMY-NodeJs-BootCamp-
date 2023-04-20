// eslint-disable-next-line import/no-extraneous-dependencies
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getChechoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  //   //2) Create Checkout session
  //   const session = await stripe.checkout.sessions.create({
  //     payment_method_types: ['card'],
  //     success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
  //       req.params.tourId
  //     }&user=${req.user.id}&price=${tour.price}`,
  //     cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
  //     customer_email: req.user.email,
  //     client_reference_id: req.params.tourId,
  //     line_items: [
  //       {
  //         name: `${tour.name} Tour`,
  //         description: tour.summary,
  //         images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
  //         amount: tour.price * 100,
  //         currency: 'usd',
  //         quantity: 1,
  //       },
  //     ],
  //   });

  //3) Send back to client
  res.status(200).json({
    status: 'success',
    tour,
    user: req.user,
  });
});
// `${req.protocol}://${req.get('host')}` ?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // Unsecure temp solution
  console.log('createBookingCheckout');
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });
  console.log('URl: ', req.originalUrl);
  //   res.redirect('http://localhost:8468/');
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
