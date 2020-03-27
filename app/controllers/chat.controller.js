const chats = require('../models/chat.model.js');

function getPopulateOptions(mode) {
	return ({
		path: 'profile',
		select: 'name color premium hat',
		lean: true
	});
}

function getMode(mode) {
	if (mode === 'tdm') {
		return chats.tdm
	} else if (mode === 'dm') {
		return chats.dm
	} else if (mode === 'ctf') {
		return chats.ctf
	} else if (mode === 'svl') {
		return chats.svl
	} else {
		throw "This is not a gamemode";
	}
}

findAllCTFProfile = (req, res) => {
	x = getMode(req.params.mode)
	var agg = x.aggregate(
		[{
			'$lookup': {
				'from': 'ctf_profiles',
				'localField': 'profile',
				'foreignField': 'player',
				'as': 'player'
			}
		}, {
			'$unwind': {
				'path': '$player'
			}
		}, {
			'$project': {
				'message': 1,
				'name': 1,
				'date_created': 1,
				'profile': 1,
				'player': 1
			}
		}]
	)
	x.aggregatePaginate(agg, {
			page: req.params.page
		})
		.then(chats => {
			res.send(chats)
		})
		.catch(err => {
			res.status(500).send(err)
		})
}

findAllTDMProfile = (req, res) => {
	x = getMode(req.params.mode)
	var agg = x.aggregate(
		[{
			'$lookup': {
				'from': 'tdm_profiles',
				'localField': 'profile',
				'foreignField': 'player',
				'as': 'player'
			}
		}, {
			'$unwind': {
				'path': '$player'
			}
		}, {
			'$project': {
				'_id': 1,
				'message': 1,
				'profile': 1,
				'player.mu': 1,
				'player.sigma': 1,
				'player.elo': 1,
				'player.kills': 1,
				'player.deaths': 1,
				'player.wins': 1,
				'player.losses': 1,
				'player.last_updated': 1
			}
		}]
	);
	x.aggregatePaginate(agg, {
			page: req.params.page
		})
		.then(chats => {
			res.send(chats)
		})
		.catch(err => {
			res.status(500).send(err)
		})
}

findAllDMProfile = (req, res) => {
	x = getMode(req.params.mode)
	var agg = x.aggregate(
		[{
			'$lookup': {
				'from': 'dm_profiles',
				'localField': 'profile',
				'foreignField': 'player',
				'as': 'player'
			}
		}, {
			'$unwind': {
				'path': '$player'
			}
		}, {
			'$project': {
				'_id': 1,
				'message': 1,
				'name': 1,
				'profile': 1,
				'player.mu': 1,
				'player.sigma': 1,
				'player.kills': 1,
				'player.deaths': 1,
				'player.last_updated': 1
			}
		}]
	)
	x.aggregatePaginate(agg, {
			page: req.params.page
		})
		.then(chats => {
			res.send(chats)
		})
		.catch(err => {
			res.status(500).send(err)
		})
}

exports.findAll = (req, res) => {
	if (req.query.lookup === 'true') {
		if (req.params.mode === 'tdm') {
			findAllTDMProfile(req, res)
		} else if (req.params.mode === 'dm') {
			findAllDMProfile(req, res)
		} else if (req.params.mode === 'ctf') {
			findAllCTFProfile(req, res)
		}
	} else {
		x = getMode(req.params.mode)
		var agg = x.aggregate(
			[{
				'$lookup': {
					'from': 'players',
					'localField': 'profile',
					'foreignField': '_id',
					'as': 'player'
				}
			}, {
				'$unwind': {
					'path': '$player'
				}
			}, {
				'$project': {
					'_id': 1,
					'message': 1,
					'date_created': 1,
					'player._id': 1,
					'player.color': 1,
					'player.hat': 1,
					'player.premium': 1,
					'player.name': 1
				}
			}]
		);
		x.aggregatePaginate(agg, {
				page: req.params.page
			})
			.then(chats => {
				res.send(chats)
			})
			.catch(err => {
				res.status(500).send(err)
			})
	}
}

exports.findUser = (req, res) => {
	x = getMode(req.params.mode)
	populateOptions = getPopulateOptions(req.params.mode)
	x.paginate({
			'profile.profile': req.params.profile,
			'profile.platform': req.params.platform
		}, {
			page: req.params.page,
			populate: populateOptions
		})
		.then(chats => {
			res.send(chats)
		})
		.catch(err => {
			res.status(500).send(err)
		})
}


exports.findContext = (req, res) => {
	x = getMode(req.params.mode);
	x.findById(req.params.chatId)
		.then(message => {
			x.find({
					_id: {
						$lte: req.params.chatId
					}
				})
				.sort({
					_id: -1
				})
				.limit(10)
				.populate('profile')
				.then(earlier => {
					x.find({
							_id: {
								$gt: req.params.chatId
							}
						})
						.limit(10)
						.then(later => {
							res.send({
								docs: earlier.reverse().concat(later)
							})
						})
						.catch(err => {
							res.status(500).send(err)
						})
				})
				.catch(err => {
					res.status(500).send(err)
				})
		})
		.catch(err => {
			res.status(500).send(err)
		})
}

exports.findKeyword = (req, res) => {
	x = getMode(req.params.mode);
	x.find({
			$text: {
				$search: req.params.searchterm
			}
		}, {
			score: {
				$meta: "textScore"
			}
		})
		.sort({
			score: {
				$meta: "textScore"
			}
		})
		.then(results => {
			res.send(results)
		})
		.catch(err => {
			res.status(500).send(err)
		})
}



exports.random = (req, res) => {
	chats.tdm.aggregate([{
			'$sample': {
				'size': 2
			}
		}, {
			'$project': {
				'message': 1
			}
		}])
		.then(function (docs) {
			res.send(docs)
		})
}