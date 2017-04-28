const CollectionsController = require('../../controllers/collectionsController');


module.exports = (router) => {
  router.route('/:collection')
    .get(CollectionsController.index)
    .post(CollectionsController.create);

  router.route('/:collection/:id')
    .get(CollectionsController.getOne)
    .put(CollectionsController.update)
    .delete(CollectionsController.remove);

  router.route('/:collection/:id/delete')
    .get(CollectionsController.getRelated);
};
