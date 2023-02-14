<?php

namespace Studio1\BatchOperationBundle\Controller;

use Pimcore\Controller\FrontendController;
use Pimcore\Model\Asset;
use Pimcore\Model\Element\Tag;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends FrontendController
{
    /**
     * @param Request $request
     * @return JsonResponse
     * @Route("/list-tags", name="plugin_batch_operations_tag_list")
     */
    public function listTagsAction(Request $request): JsonResponse
    {
        $tags = new \Pimcore\Model\Element\Tag\Listing();
        $data = [];
        foreach ($tags as $tag) {
            $data[] = ['id' => $tag->getId(), 'path' => $tag->getNamePath()];
        }
        return new JsonResponse($data);
    }

    /**
     * Add tags to assets, if action equals
     * @param Request $request
     * @return JsonResponse
     * @Route("/add-tags",name="plugin_batch_operations_tag_add")
     */
    public function addTagsAction(Request $request): JsonResponse
    {
        $replace = $request->get('replace');
        $assetIds = urldecode($request->get('assetIds'));
        $tagIds = urldecode($request->get('tagIds'));
        if (empty($assetIds)) {
            return new JsonResponse('batch_operation.tags.error.asset', 500);
        }
        if (empty($tagIds)) {
            return new JsonResponse('batch_operation.tags.error.tags', 500);
        }
        Tag::batchAssignTagsToElement('asset', explode(',', $assetIds), explode(',', $tagIds), $replace);
        $message = $replace ? 'batch_operation.tags.success.replace' : 'batch_operation.tags.success.add';
        return new JsonResponse($message);
    }
}
