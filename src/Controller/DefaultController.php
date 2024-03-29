<?php

/**
 * Studio1 Kommunikation GmbH
 *
 * This source file is available under following license:
 * - GNU General Public License v3.0 (GNU GPLv3)
 *
 * @copyright  Copyright (c) Studio1 Kommunikation GmbH (http://www.studio1.de)
 * @license    https://www.gnu.org/licenses/gpl-3.0.txt
 */

namespace Studio1\BatchOperationBundle\Controller;

use Exception;
use Pimcore\Controller\UserAwareController;
use Pimcore\Model\Asset;
use Pimcore\Model\Element\Tag;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends UserAwareController
{
    /**
     * @param Request $request
     *
     * @return JsonResponse
     * @Route("/list-tags", name="plugin_batch_operation_tag_list")
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
     * Add or replace tags to assets
     *
     * @param Request $request
     *
     * @return JsonResponse
     * @Route("/add-tags",name="plugin_batch_operation_tag_add")
     */
    public function addTagsAction(Request $request): JsonResponse
    {
        $replace = $request->get('replace');
        $assetIds = urldecode($request->get('assetIds', ''));
        $tagIds = urldecode($request->get('tagIds', ''));
        if (empty($assetIds)) {
            return new JsonResponse('batch_operation.error.asset', 500);
        }
        if (empty($tagIds)) {
            return new JsonResponse('batch_operation.tags.error', 500);
        }
        $assetIds = explode(',', $assetIds);
        $tagIds = explode(',', $tagIds);
        foreach ($assetIds as $assetId) {
            if ($replace) {
                $assetTags = Tag::getTagsForElement('asset', $assetId);
                foreach ($assetTags as $assetTag) {
                    if (!in_array($assetTag->getId(), $tagIds)) {
                        Tag::removeTagFromElement('asset', $assetId, $assetTag);
                    }
                }
            }
            foreach ($tagIds as $tagId) {
                Tag::addTagToElement('asset', $assetId, Tag::getById($tagId));
            }
        }
        $message = $replace ? 'batch_operation.tags.success.replace' : 'batch_operation.tags.success.add';

        return new JsonResponse($message);
    }

    /**
     * Move assets to selected target folder
     *
     * @param Request $request
     *
     * @return JsonResponse
     * @Route("/move",name="plugin_batch_operation_move")
     */
    public function moveAssetsAction(Request $request): JsonResponse
    {
        $assetIds = urldecode($request->get('assetIds'));
        $targetFolderId = $request->get('targetFolderId');
        if (empty($assetIds)) {
            return new JsonResponse(['message' => 'batch_operation.error.asset'], 500);
        }
        $assetIds = explode(',', $assetIds);
        $targetFolder = Asset\Folder::getById($targetFolderId);
        if (empty($targetFolder)) {
            return new JsonResponse(['message' => 'batch_operation.move.error.target'], 500);
        }
        $error = [];
        foreach ($assetIds as $assetId) {
            try {
                $asset = Asset::getById($assetId);
                $asset->setParent($targetFolder)->save();
            } catch (Exception $e) {
                $tmp = [];
                if (!empty($asset)) {
                    $tmp['key'] = $asset->getKey();
                }
                $tmp['id'] = $assetId;
                $error[] = $tmp;
            }
        }
        if (!empty($error)) {
            return new JsonResponse(['message' => 'batch_operation.move.error.asset', 'detail' => $error], 500);
        }

        return new JsonResponse('batch_operation.move.success');
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse
     * @Route("/test",name="plugin_batch_operation_test")
     */
    public function testAction(Request $request): JsonResponse
    {
        $success = $request->get('success');
        if (!$success) {
            $data = [['id' => 1, 'key' => 'Asset1'], ['id' => 2, 'key' => 'Asset2']];
            $responseCode = 500;
        } else {
            $data = 'batch_operation.move.success';
            $responseCode = 200;
        }

        return new JsonResponse($data, $responseCode);
    }
}
