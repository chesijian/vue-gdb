export const LeafletMap = function() {
    /**
     * 地图对象
     */
    this.events = {
        LAYER_CREATED: 'layer:created',
        LAYER_CLICK: 'layer:click',
        SAVE: 'save'
    };
    this.vue = null;
    this.colorArr = ["#7fffd4", "#0000ff", "#8a2be2", "#a52a2a", "#deb887", "#5f9ea0", "#7fff00", "#d2691e", "#ff7f50", "#6495ed", "#dc143c", "#00ffff", "#00008b", "#008b8b", "#b8860b", "#a9a9a9", "#006400", "#bdb76b", "#8b008b", "#556b2f", "#ff8c00", "#9932cc", "#8b0000", "#e9967a", "#8fbc8f", "#483d8b", "#2f4f4f", "#00ced1", "#9400d3", "#ff1493", "#00bfff", "#696969", "#1e90ff", "#b22222", "#228b22", "#ff00ff", "#ffd700", "#daa520", "#808080", "#008000", "#adff2f", "#ff69b4", "#cd5c5c", "#4b0082", "#f0e68c", "#7cfc00", "#add8e6", "#f08080", "#d3d3d3", "#90ee90", "#ffb6c1", "#ffa07a", "#20b2aa", "#87cefa", "#778899", "#b0c4de", "#00ff00", "#32cd32", "#ff00ff", "#800000", "#66cdaa", "#0000cd", "#ba55d3", "#9370d8", "#3cb371", "#7b68ee", "#00fa9a", "#48d1cc", "#c71585", "#191970", "#ffe4e1", "#ffdead", "#000080", "#808000", "#6b8e23", "#ffa500", "#ff4500", "#da70d6", "#98fb98", "#afeeee", "#d87093", "#ffdab9", "#cd853f", "#ffc0cb", "#dda0dd", "#b0e0e6", "#800080", "#ff0000", "#bc8f8f", "#4169e1", "#8b4513", "#fa8072", "#f4a460", "#2e8b57", "#a0522d", "#c0c0c0", "#87ceeb", "#6a5acd", "#708090", "#00ff7f", "#4682b4", "#d2b48c", "#008080", "#d8bfd8", "#ff6347", "#40e0d0", "#ee82ee", "#f5deb3", "#9acd32"];
    this.colorIndex = -1;
    //是否正在删除
    this.deleteing = false;
    //是否正在编辑
    this.editing = false;
    this.map = null;
    this.listeners = null;
    //工作面图层
    this.layerMap = {};
    //工作面图层
    this.drawnItems = null;
    this.layerCount = 0;
    //标注图层
    this.textMap = {};
    this.textItems = null;
    //工具栏
    this.drawControl = null;
    //this.iconUrl = 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2877974514,387602425&fm=26&gp=0.jpg';
    this.iconUrlArr = ['../../static/js/leaflet/lib/images/marker-icon.png'];
    // 使用用户自己的图标
    this.getIcon = function(index) {
        var iconUrl = this.iconUrlArr[index == undefined || index > this.iconUrlArr.length ? 0 : index];
        var icon = L.icon({
            iconUrl: iconUrl, //'leaf-green.png',
            shadowUrl: iconUrl, //'leaf-shadow.png',
            iconSize: [25, 41], // size of the icon
            shadowSize: [25, 41], // size of the shadow
            iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
            //shadowAnchor: [4, 62], // the same for the shadow
            // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
        });
        return icon;
    }

    /**
     * 初始化方法
     */
    this.init = function(vue, config) {
        this.vue = vue;
        var x = (config.bounds == undefined ? 1024 : config.bounds[0]);
        var y = (config.bounds == undefined ? 768 : config.bounds[1]);
        var bounds = [this.xy(0, 0), this.xy(x, y)];
        config.bounds = bounds;
        if (config.listeners != undefined) {
            this.listeners = config.listeners;
        }
        this.initMap(config);
    };
    this.initMap = function(config) {
        //console.info(L.Control);
        //console.info("=====initMap======");
        var _this = this;
        this.map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -3
        });
        //图片坐标范围 
        //var bounds = [xy(0, 0), xy(1024, 768)];
        //加载图片
        //var image = L.imageOverlay('map.jpg', config.bounds).addTo(map);
        var image = L.imageOverlay(config.imageUrl, config.bounds).addTo(this.map);
        //点坐标 


        this.drawnItems = L.featureGroup().addTo(this.map);
        this.textItems = L.featureGroup().addTo(this.map);

        //判断是否是可编辑
        if (config.tools != undefined && config.tools.edit != undefined && config.tools.edit) {
            this.drawControl = new L.Control.Draw({
                edit: {
                    featureGroup: this.drawnItems,
                    poly: {
                        allowIntersection: false
                    }
                },
                draw: {
                    polygon: config.tools.polygon == undefined || config.tools.polygon ? {
                        shapeOptions: {
                            weight: 2,
                            color: this.getColor(),
                            opacity: 1
                        },
                        allowIntersection: false,
                        showArea: true
                    } : false,
                    polyline: false,
                    rectangle: config.tools.rectangle == undefined || config.tools.rectangle ? {
                        shapeOptions: {
                            weight: 2,
                            color: this.getColor(),
                            opacity: 1
                        }
                    } : false,
                    circlemarker: false,
                    circle: false,
                    marker: config.tools.marker == undefined || config.tools.marker ? {
                        icon: this.getIcon()
                    } : false
                }
            });
            this.map.addControl(this.drawControl);
            //console.info(this.vue);
            if (config.tools.save != undefined && config.tools.save) {
                var toolList = this.$('.leaflet-draw.leaflet-control').children().last();
                if (toolList.length > 0) {
                    //找到修改和删除那一栏
                    var toolDom = this.$(toolList[toolList.length - 1]).children().first();
                    this.$(toolDom).append('<div class="leaflet-draw-edit-save" href="#" title="保存"></div>');
                    this.$('.leaflet-draw-edit-save').bind("click", function() {
                        //console.info(window);
                        //console.info(this);
                        //console.info(window.lmap);
                        lmap.saveData();
                    });

                }
            }
        }



        this.drawnItems.on("layeradd", function(c) {
            _this.drawControl.setDrawingOptions({
                polygon: {
                    shapeOptions: {
                        weight: 2,
                        color: _this.getColor(),
                        opacity: 1
                    }
                },
                rectangle: {
                    shapeOptions: {
                        weight: 2,
                        color: _this.getColor(),
                        opacity: 1
                    }
                }
            });
        });

        //初始化图层数据
        if (config.data != undefined && config.data != null && config.data.length > 0) {
            this.initLayer(config.data);
        }
        L.control.layers({}, {
            '标注': this.textItems
        }).addTo(this.map);

        this.map.setView(this.xy(config.center[0], config.center[1]), 0);

        //所有监听事件
        this.map.on('baselayerchange', function(event) {
            info("======baselayerchange======");
        });
        this.map.on('drag', function(event) {
            info("======drag======");
        });
        this.map.on('zoomend', function(event) {
            info("======zoomend======");
        });
        this.map.on(L.Draw.Event.DRAWSTART, function(event) {
            info("======L.Draw.Event.DRAWSTART======");
        });
        this.map.on(L.Draw.Event.DRAWSTOP, function(event) {
            info("======L.Draw.Event.DRAWSTOP======");
        });
        this.map.on(L.Draw.Event.DRAWVERTEX, function(event) {
            info("======L.Draw.Event.DRAWVERTEX======");
        });
        this.map.on(L.Draw.Event.MARKERCONTEXT, function(event) {
            info("======L.Draw.Event.MARKERCONTEXT======");
        });
        this.map.on(L.Draw.Event.TOOLBARCLOSED, function(event) {
            info("======L.Draw.Event.TOOLBARCLOSED======");
        });
        this.map.on(L.Draw.Event.TOOLBAROPENED, function(event) {
            info("======L.Draw.Event.TOOLBAROPENED======");
        });
        this.map.on(L.Draw.Event.DELETESTART, function(event) {
            info("======L.Draw.Event.DELETESTART======");
            lmap.deleteing = true;
        });

        this.map.on(L.Draw.Event.DELETED, function(event) {
            info("======L.Draw.Event.DELETED======");
            var layers = event.layers;
            lmap.deleteing = false;
            layers.eachLayer(function(layer) {
                if (layer.entity != undefined && layer.entity != null) {
                    lmap.removeLayer(layer.entity.uuid);
                }
            });
        });
        this.map.on(L.Draw.Event.DELETESTOP, function(event) {
            info("======L.Draw.Event.DELETESTOP======");
            lmap.deleteing = false;
            lmap.redraw();
            //info(event);
        });

        // Object created - bind popup to layer, add to feature group
        this.map.on(L.Draw.Event.CREATED, function(event) {
            info("======L.Draw.Event.CREATED======");
            var layer = event.layer;
            //添加图层到全局变量
            layer.isFirst = true;
            lmap.addLayer(layer);
            //触发添加事件
            if (lmap.listeners != null && lmap.listeners[lmap.events.LAYER_CREATED] != undefined) {
                //console.info("==============");
                lmap.listeners[lmap.events.LAYER_CREATED](layer);
            }
        });
        this.map.on(L.Draw.Event.EDITMOVE, function(event) {
            info("======L.Draw.Event.EDITMOVE======");
            var layer = event.layer;
            if (layer.entity.type != 'text') {
                //对宿主重新标注
                lmap.updateText(layer);
            }
        });
        this.map.on(L.Draw.Event.EDITSTART, function(event) {
            info("======L.Draw.Event.EDITSTART======");
            lmap.editing = true;
        });
        this.map.on(L.Draw.Event.EDITSTOP, function(event) {
            info("======L.Draw.Event.EDITSTOP======");
            lmap.redraw();
            lmap.editing = false;
        });
        this.map.on(L.Draw.Event.EDITVERTEX, function(event) {
            info("======L.Draw.Event.EDITVERTEX======");

        });
        this.map.on(L.Draw.Event.EDITRESIZE, function(event) {
            info("======L.Draw.Event.EDITRESIZE======");
            //info(event);
            var layer = event.layer;
            if (layer.entity.type != 'text') {
                //对宿主重新标注
                lmap.updateText(layer);
            }
        });
        // Object(s) edited - update popups
        this.map.on(L.Draw.Event.EDITED, function(event) {
            info("======L.Draw.Event.EDITED======");
            var layers = event.layers;
            layers.eachLayer(function(layer) {
                lmap.updateLayer(layer);
                //return;
            });

        });
        this.map.on('layerremove', function(event) {
            //info("======layerremove======");
            if (event.layer.entity != undefined && event.layer.entity != null && event.layer.entity.type != 'text') {
                lmap.removeText(event.layer.entity.uuid);
            }
        });
        this.map.on('layeradd', function(event) {
            // info("======layerreadd======");
            // console.info(event);
            // var layer = event.layer;
            // if (layer.entity == undefined) {
            //     var entity = lmap.calculateLnglats(layer);
            //     layer.entity = entity;
            //     lmap.addText(layer);
            // }

        });
    };
    this.getData = function() {
            var data = [];
            for (var key in this.layerMap) {
                var entity = this.layerMap[key].entity;
                data.push(entity);
            }
            return data;
        }
        /**
         * 保存数据
         */
    this.saveData = function() {
        var data = this.getData();
        if (lmap.listeners != null && lmap.listeners[lmap.events.SAVE] != undefined) {
            lmap.listeners[lmap.events.SAVE](data);
        }
    };
    var info = function(obj) {
        console.info(obj);
    };
    /**
     * 返回序号
     */
    this.getUUID = function() {
            this.layerCount++;
            var layer = this.getLayer(this.layerCount);
            if (layer == undefined || layer == null) {
                return this.layerCount + "";
            } else {
                return this.getUUID();
            }

        }
        /**
         * 重绘
         */
    this.redraw = function() {
            for (var key in this.layerMap) {
                var layer = this.layerMap[key];
                this.updateText(layer);
            }
        }
        /**把层级保存到全局变量 */
    this.addToMap = function(uuid, layer) {
        this.layerMap[uuid] = layer;
    }

    //初始化图层
    this.initLayer = function(data) {
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                //item.uuid = null;
                lmap.drawLayer({
                    entity: item
                });
            }
            lmap.layerCount = data.length;
        }
    }
    this.drawLayer = function(oldLayer) {
            var item = oldLayer.entity;
            var layer = null;
            if (item.type == 'Marker') {
                // //点坐标 
                layer = new L.Marker(item.latlngs, {
                    icon: lmap.getIcon(item.iconIndex == undefined ? 0 : item.iconIndex),
                    title: item.title,
                    clickable: true,
                    draggable: false
                });

            } else if (item.type == 'CircleMarker') {
                // //点坐标 
                layer = new L.CircleMarker(item.latlngs, {
                    title: item.title,
                    clickable: true,
                    draggable: false
                });
            } else if (item.type == 'Circle') {
                // //点坐标 

                var color = oldLayer.options == undefined ? lmap.getColor() : oldLayer.options.color;
                layer = new L.Circle(item.latlngs, {
                    title: item.title,
                    color: color,
                    fillColor: color,
                    fillOpacity: oldLayer.options == undefined ? 0.5 : oldLayer.options.fillOpacity,
                    radius: item.radius,
                    clickable: true,
                    draggable: false
                });
            } else if (item.type == 'Polygon') {
                //console.info("====Polygon====" + oldLayer.options.fillOpacity);
                var color = oldLayer.options == undefined ? lmap.getColor() : oldLayer.options.color;
                layer = new L.Polygon(item.latlngs, {
                    title: item.title,
                    color: color,
                    fillColor: color,
                    fillOpacity: oldLayer.options == undefined ? 0.5 : oldLayer.options.fillOpacity,
                    clickable: true,
                    draggable: true
                });
                //是否新重绘
                if (oldLayer.isRedraw != undefined && oldLayer.isRedraw) {
                    layer.isRedraw = true;
                }
                //console.info(layer);
            } else if (item.type == 'Rectangle') {
                // //点坐标 
                var color = oldLayer.options == undefined ? lmap.getColor() : oldLayer.options.color;
                //console.info("====" + (oldLayer.options == undefined ? 0.5 : oldLayer.options.fillOpacity));
                layer = new L.Rectangle(item.latlngs, {
                    title: item.title,
                    color: color,
                    fillColor: color,
                    fillOpacity: oldLayer.options == undefined ? 0.5 : oldLayer.options.fillOpacity,
                    clickable: true,
                    draggable: true
                });
                //是否新重绘
                if (oldLayer.isRedraw != undefined && oldLayer.isRedraw) {
                    layer.isRedraw = true;
                }

            }
            layer['entity'] = item;
            lmap.addLayer(layer);
        },
        this.bindLayerClick = function(layer) {
            layer.on('click', function(event) {
                //console.info(lmap.editing + "====click=======" + lmap.deleteing);
                if (lmap.editing || lmap.deleteing) {
                    return;
                }
                try {
                    // console.info(lmap.listeners);
                    if (lmap.listeners != null && lmap.listeners[lmap.events.LAYER_CLICK] != undefined) {
                        //console.info("==============");
                        lmap.listeners[lmap.events.LAYER_CLICK](layer);
                    }
                } catch (e) {
                    info("====click===error===" + e);
                }

            });
        };
    //绑定图层元素事件
    this.bindLayerLitener = function(layer) {
        this.bindLayerClick(layer);
        if (layer.entity.type == 'Marker') {
            layer.on('drag', function(event) {
                //info("=====drag=====");
                lmap.updateText(this);
            });
        } else if (layer.entity.type == 'Polygon' || layer.entity.type == 'Rectangle') {
            if (layer.entity.type == 'Polygon') {
                layer.on('edit', function(event) {
                    info("=====edit=====");
                    lmap.updateText(layer);
                });
            }

            layer.on('mouseover', function(event) {
                if (lmap.editing || lmap.deleteing) {
                    return;
                }
                var target = event.target;
                //info(target.entity.uuid + "====mouseover=====isFirst:" + target.isFirst + "===isRedraw:" + target.isRedraw);
                target.options.fillOpacity = 0;
                if ((target.isFirst != undefined && target.isFirst) || (target.isRedraw != undefined && target.isRedraw)) {
                    //info("====mouseout=====11");
                } else {
                    var options = target.options;
                    options.fillOpacity = 0.7;
                    var entity = target.entity;
                    delete lmap.layerMap[entity.uuid];
                    lmap.drawnItems.removeLayer(target);
                    lmap.drawLayer({
                        isRedraw: true,
                        options: options,
                        entity: entity
                    });
                    //console.info(lmap.drawnItems);
                    //info("====mouseover=====22");
                }

            });
            layer.on('mouseout', function(event) {
                if (lmap.editing || lmap.deleteing) {
                    return;
                }
                var target = event.target;
                //info(target.entity.uuid + "====mouseout=====isFirst:" + target.isFirst + "===isRedraw:" + target.isRedraw);
                //console.info(target);
                if (target.isFirst != undefined && target.isFirst) {
                    //lmap.drawLayer(target);

                    target.isFirst = false;
                    //info("====mouseout=====11");
                } else {
                    if (target.isRedraw != undefined && target.isRedraw) {
                        target.isRedraw = null;
                        var options = target.options;
                        var entity = target.entity;
                        options.fillOpacity = 0.5;
                        delete lmap.layerMap[entity.uuid];
                        lmap.drawnItems.removeLayer(target);
                        lmap.drawLayer({
                            isNew: true,
                            options: options,
                            entity: entity
                        });
                    } else {

                    }
                }

                return;
            });
        }

    }
    this.updateLayer = function(layer) {
            //重新计算坐标
            var newEntity = this.calculateLnglats(layer);
            layer.entity.latlngs = newEntity.latlngs;
            this.updateText(layer)
        }
        /**把层级保存到全局变量 */
    this.addLayer = function(layer) {
            var entity = null;
            //说明是新增
            if (layer.entity == undefined || layer.entity == null) {
                entity = this.calculateLnglats(layer);
                layer.entity = entity;
            } else {
                //初始化
                entity = layer.entity;
            }
            if (entity != null) {
                if (entity.uuid == undefined || entity.uuid == null) {
                    entity.uuid = this.getUUID();
                }

                if (entity.title == undefined) {
                    entity.title = '';
                }
                this.layerMap[entity.uuid] = layer;
                this.drawnItems.addLayer(layer);
                this.addText(layer);
                this.bindLayerLitener(layer);
            }
        }
        /**从全局变量移除图层 */
    this.removeLayer = function(uuid) {
            //info(layerMap);
            info("======removeLayer======");
            var layer = this.getLayer(uuid);
            if (layer != undefined && layer != null) {
                try {
                    this.drawnItems.removeLayer(layer);
                    this.removeText(uuid)
                } catch (e) {
                    info("remove error" + e);
                }
                delete this.layerMap[uuid];
            }
        }
        /**从全局变量取出图层 */
    this.getLayer = function(uuid) {
        //info(layerMap);
        var layer = this.layerMap[uuid];
        if (layer != undefined && layer != null) {
            return layer;
        }
        return null;
    }

    /**删除标注 */
    this.removeText = function(uuid) {
            var textUUID = uuid;
            var layer = this.textMap[textUUID];
            if (layer != undefined && layer != null) {
                this.textItems.removeLayer(layer);
                delete this.textMap[textUUID];
            }
        }
        /*修改标注*/
    this.updateText = function(layer) {
            //重新计算坐标
            var newEntity = this.calculateLnglats(layer);
            newEntity.uuid = layer.entity.uuid;
            newEntity.title = layer.entity.title;
            this.addText({
                entity: newEntity
            });
        }
        /*添加标注*/
    this.addText = function(layer) {
        //info("======addText======");
        var entity = layer.entity;
        //info(typeof entity.uuid + "==========" + entity.uuid);
        if (typeof entity.uuid != 'number' && entity.type == 'text') {
            return;
        }
        var textHtml = this.prefixInteger(entity.uuid, 2);
        if (entity.title != undefined && entity.title != null && entity.title.length > 0) {
            textHtml = entity.title;
        }
        //layer.bindPopup(textHtml).openPopup();
        //return;
        //删除旧的标注
        lmap.removeText(entity.uuid);
        var textUUID = entity.uuid;
        //info(textHtml.length);
        var textIcon = L.divIcon({
            html: textHtml,
            className: 'text-icon',
            iconSize: [12 * textHtml.length, 20]
                //className: 'my-div-icon',
                //iconSize: 50
        });
        var textPoint = null;
        if (entity.type == 'Marker') {
            //点坐标 
            textPoint = [entity.latlngs[0], entity.latlngs[1]];

        } else if (entity.type == 'CircleMarker') {

        } else if (entity.type == 'Circle') {
            // //点坐标 

        } else if (entity.type == 'Polygon') {
            // //点坐标 
            var center = null;
            try {
                center = layer.getCenter();
            } catch (e) {
                //第一次打开地图，区域还未渲染，所以无法调用，只能计算中心点
                var x_sum = 0;
                var y_sum = 0;
                for (var i = 0; i < entity.latlngs.length; i++) {
                    x_sum = x_sum + entity.latlngs[i][0];
                    y_sum = y_sum + entity.latlngs[i][1];
                }
                center = {
                    lat: x_sum / entity.latlngs.length,
                    lng: y_sum / entity.latlngs.length
                };
            }

            //info(center);
            textPoint = [center.lat, center.lng];
        } else if (entity.type == 'Rectangle') {
            // //点坐标 
            var x = (entity.latlngs[0][0] + entity.latlngs[1][0]) / 2
            var y = (entity.latlngs[0][1] + entity.latlngs[2][1]) / 2
            textPoint = [x, y];
        } else if (entity.type == 'Polyline') {
            // //点坐标 

        }
        if (textPoint == null) {
            return;
        }
        var textLayer = new L.Marker(textPoint, {
            icon: textIcon,
            clickable: false,
            draggable: false
        });
        textLayer.entity = {
            uuid: textUUID,
            type: 'text',
            latlngs: textPoint
        };
        lmap.textItems.addLayer(textLayer);
        lmap.textMap[textUUID] = textLayer;
        //console.info(lmap.textItems);
        //console.info(lmap.textMap);
        //添加图层到全局变量
        //addToMap(textLayer.entity.uuid, textLayer);
    }
    this.yx = function(y, x) {
            return L.latLng(y, x);
        }
        /**
         * 如参数是1，2则返回01
         * @param {*} num 
         * @param {*} n 
         */
    this.prefixInteger = function(num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
    this.xy = function(x, y) {
        if (L.Util.isArray(x)) { // When doing xy([x, y]);
            return this.yx(x[1], x[0]);
        }
        return this.yx(y, x); // When doing xy(x, y);
    };
    this._round = function(num, len) {
        return Math.round(num * (Math.pow(10, len))) / (Math.pow(10, len));
    };
    /**
     * 计算坐标
     * @param {*} layer 
     */
    this.calculateLnglats = function(layer) {
        var entity = {};
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            //info("========Marker or CircleMarker========");
            entity['type'] = layer instanceof L.Marker ? 'Marker' : 'CircleMarker';
            entity['latlngs'] = [layer.getLatLng().lat, layer.getLatLng().lng];
            if (layer.getRadius != undefined) {
                radius = layer.getRadius();
                // info("radius========" + radius);
                entity['radius'] = radius;
                if (radius == 10) {
                    entity['type'] = 'CircleMarker';
                } else {
                    entity['type'] = 'Circle';
                }
            }
            //info(L.Draw.Event);

        } else if (layer instanceof L.Circle) {
            //info("========Circle========");
            entity['type'] = 'Circle';
            entity['latlngs'] = [layer.getLatLng().lat, layer.getLatLng().lng];
            // Rectangle/Polygon - area
        } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
            //info("========Polygon or Rectangle========");
            entity['type'] = layer instanceof L.Polygon ? 'Polygon' : 'Rectangle';
            var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
                distance = 0;
            if (latlngs.length < 2) {
                alert("Distance: N/A");
            } else {
                var latlngsArr = [];
                for (var i = 0; i < latlngs.length; i++) {
                    //latlngsArr.push([latlngs[i].lng, latlngs[i].lat]);
                    latlngsArr.push([latlngs[i].lat, latlngs[i].lng]);
                }
                //判断是否是矩形
                if (latlngsArr.length == 4) {
                    if ((latlngsArr[0][0] - latlngsArr[3][0]) == 0 && (latlngsArr[0][1] - latlngsArr[1][1]) == 0 && (latlngsArr[1][0] -
                            latlngsArr[2][0]) == 0 && (latlngsArr[2][1] - latlngsArr[3][1]) == 0) {
                        entity['type'] = 'Rectangle';
                        //info("===Rectangle===");
                    } else {
                        entity['type'] = 'Polygon';
                    }
                }
                if (latlngsArr.length == 2) {
                    entity['type'] = 'Polyline';
                }
                entity['latlngs'] = latlngsArr;
            }
        } else if (layer instanceof L.Polyline) {

            //info("========Polyline========");
            entity['type'] = 'Polyline';
            var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs(),
                distance = 0;
            if (latlngs.length < 2) {
                alert("Distance: N/A");
            } else {
                var latlngsArr = [];
                for (var i = 0; i < latlngs.length; i++) {
                    //distance += latlngs[i].distanceTo(latlngs[i + 1]);
                    latlngsArr.push([latlngs[i].lat, latlngs[i].lng]);
                }
                entity['latlngs'] = latlngsArr;
            }
        } else {
            entity = null;
        }
        return entity;
    };

    this.getColor = function() {
        return this.colorIndex++, this.colorIndex %= this.colorArr.length, this.colorArr[this.colorIndex];
    }
}
export const lmap = new LeafletMap();
window.lmap = lmap;