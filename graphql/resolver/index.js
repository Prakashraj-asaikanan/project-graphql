const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EventDetails = require('../../models/event');
const UserDetails = require('../../models/user');
const Booking = require('../../models/booking');

const EventDet = eventid => EventDetails.findById({
    _id: eventid
}).then(res => {
    return {
        ...res._doc,
        creator: userDet.bind(this, res.creator)
    }
});
const userDet = userID => UserDetails.findById({
    _id: userID
}).then(res => {
    return {
        ...res._doc
    }
})

module.exports = {
    Query: {
        events: async (req) => {
            // if(!req.isAuth)
            // {
            //     const ErrorMessage = "You're not Authenticated"
            //     throw new Error(ErrorMessage);
            // }
            return EventDetails.find().then(res => {
                return res;
            }).catch(err => {
                throw err;
            });
        },
        booking: () => {

            return Booking.find().then(result => {
                return result.map(userevent => {
                    return {
                        ...userevent._doc,
                        event: EventDet.bind(this, userevent.event),
                        user: userDet.bind(this, userevent.user),
                        createdAt: new Date(userevent._doc.createdAt).toISOString(),
                        updatedAt: new Date(userevent._doc.updatedAt).toISOString()
                    }
                })
            }).catch(error => {
                throw error;
            })
        },
        login: ({ email, password }) => {
            console.log(email);
            return UserDetails.findOne({
                email: email
            }).then(result => {

                if (!result) {
                    throw new Error("User doesn't exit");
                }
                return bcrypt.compare(password, result.password).then(res => {
                    console.log(res);
                    if (!res) {
                        throw new Error("Password is incorrect");
                    }
                    const token = jwt.sign({ userId: result.id, email: result.email }, 'IMIRONMAN', {
                        expiresIn: '1h'
                    })
                    return {
                        userId: result.id,
                        token: token,
                        tokenExpiration: 1
                    }
                });
            })
        },
        user: () => {
            return UserDetails.find().then(res => {
                return res;
            }).catch(err => {
                throw err;
            })
        },
        eventUsers: () => {
            return EventDetails.find().populate('creator').then(result => {
                return result.map(evt => {
                    return {
                        ...evt._doc
                    }
                });
            }).catch(err => {
                throw err;
            })
        },
    },
    Mutation: {
        createEvent: (args, req) => {
            if (!req.isAuth) {
                const ErrorMessage = "You're not Authenticated"
                throw new Error(ErrorMessage);
            }
            const event = new EventDetails({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5f57390d6b867e3ff3a9d61f'
            });
            let createdEvent;
            return event
                .save()
                .then(result => {
                    createdEvent = {
                        ...result._doc,
                        _id: result._doc._id.toString()
                    };
                    return UserDetails.findById('5f57390d6b867e3ff3a9d61f');
                })
                .then(user => {
                    if (!user) {
                        throw new Error('User not found.');
                    }
                    user.createdEvents.push(event);
                    return user.save();
                })
                .then(result => {
                    return createdEvent;
                })
                .catch(err => {
                    throw err;
                });
        },
        createUser: (args, req) => {
            return UserDetails.findOne({
                email: args.userInput.email
            }).then(result => {
                if (result) {
                    throw new Error('User Already Exist');
                }
                return bcrypt.hash(args.userInput.password, 12)
            }).then(pass => {
                const users = new UserDetails({
                    email: args.userInput.email,
                    password: pass
                });
                return users.save();
            })
                .then(result => {
                    return {
                        ...result._doc,
                        password: null
                    }
                })
                .catch(err => {
                    throw err;
                })
        },
        bookEvent: (args) => {
            return EventDetails.findOne({
                _id: args.eventId
            })
                .then(result => {
                    if (!result) {
                        throw new error('Event not exit');

                    }
                    const booked = new Booking({
                        user: '5f5741d823db2f5fe8a22119',
                        event: result
                    })
                    return booked.save();
                }).then(res => {
                    return {
                        ...res._doc,
                        _id: res.id,
                        event: EventDet.bind(this, res._doc.event._id),
                        user: userDet.bind(this, res._doc.user),
                        createdAt: new Date(res._doc.createdAt).toISOString(),
                        updatedAt: new Date(res._doc.updatedAt).toISOString()
                    }
                }).catch(error => {
                    throw error;
                })

        },
        cancelEvent: (args) => {
            return Booking.findById(args.bookingId).populate('event').then(bookresult => {
                if (!bookresult) {
                    throw new Error('There is no Event');
                }
                return Booking.deleteOne({
                    _id: bookresult._id
                }).then(result => {
                    return {
                        ...bookresult.event._doc,
                        creator: userDet.bind(this, bookresult.event._doc.creator)
                    }
                }).catch(error => {
                    throw error;
                })
            }).catch(error => {
                throw error;
            })

        }
    }
}