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

namespace Studio1\BatchOperationBundle;

use Exception;
use Pimcore\Extension\Bundle\AbstractPimcoreBundle;
use Pimcore\Extension\Bundle\PimcoreBundleAdminClassicInterface;
use Pimcore\Extension\Bundle\Traits\BundleAdminClassicTrait;
use Pimcore\Extension\Bundle\Traits\PackageVersionTrait;

/**
 * Batch operation bundle
 */
class BatchOperationBundle extends AbstractPimcoreBundle implements PimcoreBundleAdminClassicInterface
{
    use BundleAdminClassicTrait;
    use PackageVersionTrait {
        getVersion as protected getComposerVersion;
    }

    /**
     * Returns the composer package name used to resolve the version
     *
     * @return string
     */
    protected function getComposerPackageName(): string
    {
        return 'studio1/batch-operation';
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        try {
            return $this->getComposerVersion();
        } catch (Exception $e) {
            return 'unknown';
        }
    }

    /**
     * @inheritDoc
     */
    public function getDescription(): string
    {
        return 'Add additional asset batch operations for tagging and moving files';
    }

    /**
     * @inheritDoc
     */
    public function getJsPaths(): array
    {
        return [
            '/bundles/batchoperation/js/pimcore/Asset/Tag.js',
            '/bundles/batchoperation/js/pimcore/Asset/Move.js',
        ];
    }
}
