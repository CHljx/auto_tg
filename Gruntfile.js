module.exports = function(grunt){
    grunt.initConfig({
        _path: {
            "Dialog": "./development/interfix/Dialog/",
            "components": "./development/components/"
        },

        copy: {
            addComponent: {
                options: {
                    noProcess: ["**/*.{png,jpg,jpeg,gif}"],
                    process: function(content, srcPath){
                        var author = grunt.config.data._var.author;
                        var name = grunt.config.data._var.name;

                        return content
                            .replace(/{@AUTHOR}/g, author)
                            .replace(/{@NAME}/g, name);
                    }
                },
                expand: true,
                cwd: "<%= _path.components %>_tpl",
                src: "**",
                dest: "<%= _path.components %><%= _var.name %>",
                filter: ""
            },
            pubComponent: {
                options: {
                    processContentExclude: ["**/*.{png,jpg,jpeg,gif}"],
                    process: function(content, path) {
                        if (/index\.css/.test(path)) {
                            return content
                                /**
                                 * 路径会被替换的几种情况：
                                 * 1. images/
                                 * 2. "images/"
                                 * 3. 'images/'
                                 * 4. ./images/
                                 * 5. "./images/"
                                 * 6. './images'
                                 *
                                 * 以 http 开头的不替换
                                 */
                                .replace(/("|\(|')(\.\/)?images\//g, function(matched, p1) {
                                    return p1 + "http://test.admin.tg.37wan.com/static/page_component/components/" + grunt.config.data._var.name + "/images/"
                                })
                                .replace(/(\n)|(\s+(?={))/g, "")
                                .replace(/{\s*/g, "{")
                                .replace(/\s*}/g, "}")
                                .replace(/:\s*/g, ":")
                                .replace(/;\s*/g, ";")
                                .replace(/,\s*/g, ",");
                        }

                        return content
                            .replace(/("|\(|')(\.\/)?images\//g, function(matched, p1) {
                                return p1 + "http://huodong.37.com/fe-editor/res/publish/components/" + grunt.config.data._var.name + "/images/"
                            })
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: "<%= _path.components %><%= _var.name %>",
                        src: ["**", "!README.md", "!viewer.html"],
                        dest: "./publish/components/<%= _var.name %>"
                    }
                ]
            },
            addDialog:{
                options: {
                    noProcess: ["**/*.{png,jpg,jpeg,gif}"],
                    process: function(content, srcPath){
                        var author = grunt.config.data._var.author;
                        var name = grunt.config.data._var.name;

                        return content
                            .replace(/{@AUTHOR}/g, author)
                            .replace(/{@NAME}/g, name);
                    }
                },
                expand: true,
                cwd: "<%= _path.Dialog %>styles/_tpl",
                src: "**",
                dest: "<%= _path.Dialog %>styles/<%= _var.name %>",
                filter: ""
            },
            pubDialog:{
                options: {
                    noProcess: ["**/*.{png,jpg,jpeg,gif}"],
                    process: function(content, path){
                        var name = grunt.config.data._var.name;
                        var cssText = grunt.file.read('development/interfix/Dialog/styles/' + name + '/index.min.css');
                        return content
                            .replace(/{@CSS}/g, cssText);
                    }
                },
                expand: true,
                cwd: "<%= _path.Dialog %>styles/<%= _var.name %>",
                src: ["**", "!*.css"],
                dest: "./publish/interfix/Dialog/styles/<%= _var.name %>",
                filter: ""
            },
            pubCommonJS: {

            }

        },

        cssmin: {
            Dialog: {
                files: {
                    "<%= _path.Dialog %>styles/<%= _var.name %>/index.min.css":['<%= _path.Dialog %>css/common.css', '<%= _path.Dialog %>styles/<%= _var.name %>/index.css']
                }
            },
            index:{
                files:{
                    "./publish/components/<%= _var.name %>/index.css":  "./publish/components/<%= _var.name %>/index.css"
                }
            }
        },

        htmlmin: {
            components: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    "./publish/components/<%= _var.name %>/index.html": "./publish/components/<%= _var.name %>/index.html"
                }
            }
        },

        uglify: {
            components: {
                files: {
                    "./publish/components/<%= _var.name %>/js/*.js": "./publish/components/<%= _var.name %>/js/*.js"
                },
                files: [{
                    expand: true,
                    cwd: "./publish/components/<%= _var.name %>/js",
                    src: "**/*.js",
                    dest: "./publish/components/<%= _var.name %>/js"
                }]
            },
            commonjs: {
                files: {
                    "./common/pub/<%= _var.name %>": "./common/dev/<%= _var.name %>"
                },
                files: [{
                    expand: true,
                    cwd: "./common/dev/<%= _var.name %>",
                    src: "**/*.js",
                    dest: "./common/pub/<%= _var.name %>"
                }]
            }
        },

        postcss: {
            options: {
                processors: [
                    require("autoprefixer")
                ]
            },
            dist: {
                src: "./publish/components/<%= _var.name %>/*.css"
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-postcss');

    grunt.registerTask("add", "add components or add Dialog style", function(what, name, author){

        var length = arguments.length;

        if( length <= 2 ) {
            grunt.log.warn( "请使用正确的命令，如：grunt add:[Module]:[PathName]:[Author]" );
            return;
        }

        if ( what !== 'Dialog' && what !== 'components' ) {
            grunt.log.warn( "请输入正确的操作模块：Dialog、components" );
            return;
        }

        switch ( what ) {
            case 'components':
                var path = grunt.config.get( "_path" )[what];

                if ( grunt.file.exists( path + name ) ) {
                    grunt.log.warn( "[" + name + "] is already exist in [" + path + "]!");
                    return;
                }

                grunt.config.set("_var.author", author);
                grunt.config.set("_var.name", name);
                grunt.task.run("copy:addComponent");
                break;

            case 'Dialog':
                var path = grunt.config.get( "_path" )[what];

                if ( grunt.file.exists( path + "styles/" + name ) ) {
                    grunt.log.warn( "[" + name + "] is already exist in [" + path + "styles/]!");
                    return;
                }

                grunt.config.set("_var.author", author);
                grunt.config.set("_var.name", name);
                grunt.task.run("copy:addDialog");
                break;

            default:
                return;

        }
    });

    grunt.registerTask("pubAllDialog", "publish all Dialog", function(){
        var dir = "", taskArray = [];
        grunt.file.recurse('./development/interfix/Dialog/styles/', function(abspath,rootdir, subdir, filename){
            if( subdir && subdir !== "_tpl" && dir !== subdir ) {
                dir = subdir;
                taskArray.push( "pub:Dialog:" + subdir );
            }
        });
        grunt.task.run(taskArray)
    });

    grunt.registerTask("pub", "publish components or Dialog style", function(what, name){
        var length = arguments.length;

        if( length <= 1 ) {
            grunt.log.warn( "请使用正确的命令，如：grunt pub:[Module]:[PathName]" );
            return;
        }

        if ( what !== 'Dialog' && what !== 'components' ) {
            grunt.log.warn( "请输入正确的操作模块：Dialog、components" );
            return;
        }

        switch (what) {
            case 'components':
                var path = grunt.config.get( "_path" )[what];

                if ( !grunt.file.exists( path + name ) ) {
                    grunt.log.warn( "[" + name + "] is not exist in [" + path + "]!");
                    grunt.log.warn( "please add first!");
                    return;
                }

                grunt.config.set("_var.name", name);

                //copy components typeMap config to publish
                var typeMap = grunt.file.readJSON("./development/components/config.json").typeMap;
                grunt.file.write("./publish/components/config.json", JSON.stringify({
                    typeMap: typeMap
                }));

                grunt.task.run(["copy:pubComponent", "htmlmin:components", "uglify:components", "postcss","cssmin:index"]);

                break;

            case 'Dialog':
                var path = grunt.config.get( "_path" )[what];

                if ( !grunt.file.exists( path + "styles/" + name ) ) {
                    grunt.log.warn( "[" + name + "] is not exist in [" + path + "styles/]!");
                    grunt.log.warn( "please add first!");
                    return;
                }

                grunt.config.set("_var.name", name);

                grunt.task.run(["cssmin:Dialog", "copy:pubDialog"]);
                break;

            default:
                return;

        }
    })

    grunt.registerTask("pubCommonJS", "uglify common js", function(name){
        var path = './common/dev/' + name;
        if ( !grunt.file.exists( path ) ) {
            grunt.log.warn( "file is not exist!");
            return;
        }
        grunt.config.set("_var.name", name);
        grunt.task.run(['uglify:commonjs'])
    });
};
