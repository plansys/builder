<?php

namespace Plansys\Builder\Module;

use PhpParser\Node\Scalar\MagicConst\File;
use Plansys\Codegen\ClassCode;
use Symfony\Component\Filesystem\Filesystem;

class Page
{
    use Page\Css;
    use Page\Html;
    use Page\Js;
    use Page\Redux;
    use Page\Setting;

    private $moduleName;
    private $module;
    private $filename;
    private $pageName;
    private $path;
    private $ast;

    public function __construct($moduleName, $module, $pageName, $path = '')
    {
        if (!isset($module['dir'])) {
            throw new \Exception('Module parameter should have "dir" key');
        }

        if (!is_dir($module['dir'])) {
            throw new \Exception('Module["dir"] parameter is not a directory (' . $module['dir'] . ')');
        }

        $pageName = preg_replace("/[^A-Za-z0-9_]/", '', $pageName);
        $filename = '/' . trim($path, '/') . '/' . ucfirst($pageName) . '.php';
        $filename = @$module['dir'] . $filename;

        $this->module = $module;
        $this->pageName = $pageName;
        $this->path = $path;
        $this->moduleName = $moduleName;
        $this->filename = $filename;
        $this->ast = new ClassCode($filename);
    }

    public function getArray()
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