<?php

namespace Plansys\Builder\Module;

use PhpParser\Node\Scalar\MagicConst\File;
use Plansys\Codegen\ClassCode;
use Symfony\Component\Filesystem\Filesystem;

class Pages
{
    use Pages\Css;
    use Pages\Html;
    use Pages\Js;
    use Pages\Redux;
    use Pages\Setting;

    private $moduleName;
    private $module;
    private $filename;
    private $pageName;
    private $path;
    private $ast;
    private $instance;

    public function __construct($base, $moduleName, $pageName, $path = '')
    {
        $module = $base->modules[$moduleName];
        if (!isset($module['dir'])) {
            throw new \Exception('Module parameter should have "dir" key');
        }

        if (!is_dir($module['dir'])) {
            throw new \Exception('Module["dir"] parameter is not a directory (' . $module['dir'] . ')');
        }

        $pageName = preg_replace("/[^A-Za-z0-9_]/", '', $pageName);
        $path = str_replace('\\', '/', $path);
        $filename = '/' . trim($path, '/') . '/' . ucfirst($pageName) . '.php';
        $filename = @$module['dir'] . $filename;

        $this->module = $module;
        $this->pageName = $pageName;
        $this->path = $path;
        $this->moduleName = $moduleName;
        $this->filename = $filename;
        $this->ast = new ClassCode($filename);

        $pagePathName = trim(str_replace('/', '.', $path), '.');
        $fullPageName = (trim($pagePathName) != '' ? $pagePathName . '.' : '') . $pageName;
        $this->instance = $base->newPage(($moduleName == '' ? '' : $moduleName. ':') . $fullPageName);
    }

    public function open()
    {
        return [
            'html' => $this->getHtml(),
            'js' => $this->getJs(),
            'css' => $this->getCss(),
            'redux' => $this->getRedux(),
            'setting' => $this->getSetting()
        ];
    }

    public function save()
    {
        $this->processNamespace();
        $this->processClass();
        $this->ast->save();
    }

    public function getModuleName() {
        return $this->moduleName;
    }

    public function getModule() {
        return $this->module;
    }

    public function getPageName() {
        return $this->pageName;
    }

    public function getPath() {
        return $this->path;
    }

    public function getFilename() {
        return $this->filename;
    }

    protected function processNamespace()
    {
        $path = str_replace("/", '\\', trim($this->path, '/'));
        if ($path != '') {
            $path = '\\' . $path;
        }
        $this->ast->namespace = $this->moduleName . '\Pages' . $path;
    }

    protected function processClass()
    {
        $invalidExtends = !$this->ast->extends || !is_subclass_of((string)$this->ast->extends, '\Yard\Page');
        if ($invalidExtends) {
            $this->ast->extends = '\Yard\Page';
        }
    }

}