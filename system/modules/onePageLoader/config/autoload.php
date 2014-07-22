<?php

/**
 * Contao Open Source CMS
 *
 * Copyright (c) 2005-2014 Leo Feyer
 *
 * @package OnePageLoader
 * @link    https://contao.org
 * @license http://www.gnu.org/licenses/lgpl-3.0.html LGPL
 */


/**
 * Register the templates
 */
TemplateLoader::addFiles(array
(
	'j_onePageLoader'   => 'system/modules/onePageLoader/templates/jquery',
	'moo_onePageLoader' => 'system/modules/onePageLoader/templates/mootools',
));
