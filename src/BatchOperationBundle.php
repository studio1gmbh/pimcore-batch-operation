<?php

namespace Studio1\BatchOperationBundle;

use Pimcore\Extension\Bundle\AbstractPimcoreBundle;

class BatchOperationBundle extends AbstractPimcoreBundle
{
    public function getVersion()
    {
        return '1.0.0';
    }

    public function getNiceName()
    {
        return 'Batch operation';
    }

    public function getDescription()
    {
        return 'Add addtional asset batch operations for tagging and moving files';
    }

    public function getJsPaths()
    {
        return [
            '/bundles/batchoperation/js/pimcore/Asset/Tag.js',
            '/bundles/batchoperation/js/pimcore/Asset/Move.js',
        ];
    }
}
