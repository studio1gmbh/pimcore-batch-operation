<?php

/**
 * Studio1 Kommunikation GmbH
 *
 * This source file is available under following license:
 * - GNU General Public License v3.0 (GNU GPLv3)
 *
 *  @copyright  Copyright (c) Studio1 Kommunikation GmbH (http://www.studio1.de)
 *  @license    https://www.gnu.org/licenses/gpl-3.0.txt
 */

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
