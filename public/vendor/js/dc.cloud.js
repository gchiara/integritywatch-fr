(function(dc, d3){
    dc.wordCloud = function(parent, chartGroup) {
        var WORD_CLASS = "dc-cloud-word",
            _chart = dc.colorChart(dc.baseChart({})),
            _size = [400, 400],
            _padding = 1,
            _timeInterval = 10,
            _duration = 500,
            _font = "Impact",
			//_scale = d3.scale.log().range([10, 20]),
            _scale = d3.scaleLinear().domain([10,100]).range([10, 25]),
            _spiral = 'archimedean',
			//_spiral = 'rectangular',
            _selectedWords = null,
			//_fontSize = function(d) { return _scale(+d.value); },
            _fontSize = function(d) { return parseInt(_scale(+d.value)); },
            _text = function(d) { return d.key; },
            _rotate = function(d) { return 0; },
            _textAccessor = function(d) { throw "missing mandatory textAccessor(d) function"},
            _onClick = function(d) { 
                _chart.filter(_text(d));
            },
            // Containers
            _g, _fg, _bg, tags,
            // From Jonathan Feinberg's cue.language, see lib/cue.language/license.txt.
            maxLength = 20,
            _maxWords = 200,
            words = [],
			
            _stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall|la|du|mr|commissioner|et|des|dg|commission|de|pour|en|les|le|meeting|eu|new|priorities|presentation|preparation|issues|meetings|representatives|work|implementation|general|future|challenge|challenge|skey|role|exchange|views|discuss|discussion|various director|talks|position|global|field|level|initiative|company|state|aspects|context|current|change|european|potential|including|dans|within|developments|play|present|Päris|Enegry|deep|Susan|Danger|Managing|Director|AmCham|Karl|Cox|Vice|President|Oracle| Bert|Boers|SAS|Marco|Comastri|EMEA|CA|Patrick|Deconinck|Senior|Western|3M|Harry|van| Dorenmalen|Chairman|IBM|Aongus|Hegarty|Dell|Cindy|Miller|UPS|Christian|Morales|Manager|Intel| |Julián|Nebreda|AES|Peter|Ryan|VP|HP|Nigel|Lewis|Caterpillar|Dirk|Ostijn|Head|&| Chief|Executive |Officer|MetLife|CA|flagship|related|portfolio|Cssr|Jourova|(| voting|all|expats|as|part|)|,|Year)$/,
			
            _punctuation = /[!"&()*+,-\.\/:;<=>?\[\\\]^`\{|\}~]+/g,
            _wordSeparators = /[\s\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g,
            _searchBreak = "("+_punctuation.source+"|"+_wordSeparators.source+")",
            discard = /^(@|https?:)/,
            htmlTags = /(<[^>]*?>|<script.*?<\/script>|<style.*?<\/style>|<head.*?><\/head>)/g,
            _normalize = function(d) { return d; };

        // Note - there's a bug (?) in the d3.layout.wordCloud engine that
        // will lose a word that is disproportionately large for the cloud.
        // It's possible to track when this occurs by checking the length of
        // tags pre-render and post-render
        var _preRenderTagLength = -1;

        _chart.width(_size[0]);
        _chart.height(_size[1]);

        // Accessors
        _chart.size = function(s) {
            if (!arguments.length) return _size;
            _size = s;
            _chart.width(_size[0]);
            _chart.height(_size[1]);
            return _chart;
        };

        _chart.splitAt = function(s) {
            if (!arguments.length) return _wordSeparators;
            _wordSeparators = s;
            return _chart;
        }

        _chart.stopWords = function(s) {
            if (!arguments.length) return _stopWords;
            _stopWords = s;
            return _chart;
        }

        _chart.punctuation = function(p) {
            if (!arguments.length) return _punctuation;
            _punctuation = p;
            return _chart;
        }

        _chart.normalize = function(n) {
            if (!arguments.length) return _normalize;
            _normalize = n;
            return _chart;
        }

        _chart.maxWords = function(w) {
            if (!arguments.length) return _maxWords;
            _maxWords = w;
            return _chart;
        }

        _chart.onClick = function(h) {
            if (!arguments.length) return _onClick;
            _onClick = h;
            return _chart;
        }

        _chart.scale = function(s) {
            if (!arguments.length) return _scale;
            _scale = s;
            return _chart;
        }

        _chart.duration = function(d) {
            if (!arguments.length) return _duration;
            _duration = d;
            return _chart;
        }

        _chart.timeInterval = function(t) {
            if (!arguments.length) return _timeInterval;
            _timeInterval = t;
            return _chart;
        }

        _chart.font = function(f) {
            if (!arguments.length) return _font;
            _font = f;
            return _chart;
        }

        _chart.fontSize = function(f) {
            if (!arguments.length) return _fontSize;
            _fontSize = f;
            return _chart;
        }

        _chart.rotate = function(r) {
            if (!arguments.length) return _rotate;
            _rotate = r;
            return _chart;
        }

        _chart.textAccessor = function(f) {
            if (!arguments.length) return _textAccessor;
            _textAccessor = f;
            return _chart;
        }

        _chart.padding = function(p) {
            if (!arguments.length) return _padding;
            _padding = p;
            return _chart;
        }

        _chart.text = function(t) {
            if (!arguments.length) return _text;
            _text = t;
            return _chart;
        }

        _chart.spiral = function(s) {
            // 'archimedean' or 'rectangular'
            if (!arguments.length) return _spiral;
            _spiral = s;
            return _spiral;
        }

        // Read only properties
        _chart.cx = function () {
            return _chart.width()>>1;
        }

        _chart.cy = function () {
            return _chart.height()>>1;
        }


        // Rendering & Drawing helpers
        function drawChart() {
            getCloudWords();

            _preRenderTagLength = tags.length;

            var cloud = makeCloud();

            words = [];

            cloud.stop()
                .words(tags.slice(0, _maxWords), function(d) {
                    return d.text.toLowerCase();
                })
                .start();

        }

        function makeCloud() {
            return d3.layout.cloud()
                .size(_size)
                .on('end', drawWords)
                .timeInterval(_timeInterval)
                .text(_text)
                .font(_font)
                .fontSize(_fontSize)
                .rotate(_rotate)
                .padding(_padding)
                .spiral(_spiral);
        }

        function drawWords(data, bounds) {
            // Adapted from Jason Davies' demo app;
            if(_g) {
                var scale = bounds ? Math.min(
                    _size[0] / Math.abs(bounds[1].x - _size[0] / 2),
                    _size[0] / Math.abs(bounds[0].x - _size[0] / 2),
                    _size[1] / Math.abs(bounds[1].y - _size[1] / 2),
                    _size[1] / Math.abs(bounds[0].y - _size[1] / 2)) / 2 : 1;
                words = data;
                
                if(words.length!=_preRenderTagLength) {
                    //console.log( "Tag cloud lost "+
                    //    (_preRenderTagLength-words.length)
                    //    +" words.");
                }

                var text = _fg.selectAll('text')
                    .data(words, function(d) {
                        return d.text.toLowerCase();
                    });

                var _translator = function(d) {
                    return 'translate('+ [d.x, d.y] +')rotate('+ d.rotate +')';
                }

                var _sizer = function(d) {
                    return _fontSize(d) +"px";
                }

                // New texts
                text.transition()
                    .duration(_duration)
                    .attr('transform', _translator)
                    .style('font-size', _sizer)

                text.enter().append('text')
                        .attr('class', WORD_CLASS)
                        .style('font-size', _sizer)
                        .style('font-family', _font)
                        .style('fill', _chart.getColor)
                        //.style('opacity', 1e-6)
                        .style('cursor', 'pointer')
                        .text(_text)
                        .attr('text-anchor', 'middle')
                        .attr('transform', _translator)
                        .on('click', _onClick)
                    .transition()
                        .duration(_duration)
                        //.style('opacity', 1);

                var exitGroup = _bg.append("g")
                    .attr("transform", _fg.attr("transform"));

                var exitGroupNode = exitGroup.node();
                
                text.exit().each(function() {
                    exitGroupNode.appendChild(this);
                });

                exitGroup.transition()
                    .duration(_duration)
                    .style("opacity", 1e-6)
                    .remove();
                
                _fg.transition()
                    .delay(_duration)
                    .duration(.75*_duration)
                    .attr("transform",
                          "translate("+ [_chart.cx(), _chart.cy()] +")"
                          +"scale("+scale+")");
            }
        }

        function getCloudWords() {
			//console.log(_chart.dimension);
            var texts = _chart.dimension().top(Infinity);
			//var texts = _chart.dimension.top(Infinity);
            //var texts = _chart.group().all();
            var   lump = '';
                //_valueAccessor = _chart.valueAccessor();
            var t = _textAccessor;

            texts.forEach(function(d) {
                lump += ',' + t(d);
            });

            parseText(lump);
        }

        function parseText(text) {
            // Thanks to Jason Davies. Stores word counts in `tags`
			
            tags = {};
            var cases = {};

			var test = "Testing a digital market today";
			
			test.split(_wordSeparators).forEach(function(word) {
				//alert(word);
			});
			
            text.split(_wordSeparators).forEach(function(word) {
				
                if (discard.test(word)) {
                    return;
                }

                word = _normalize(word);				

				
				//If there is a comma revert words
				if(word.indexOf(',') > 0){
					var commaword = word.split(',');
					word = commaword[1]+' '+commaword[0];
				}
				

                word = word.replace(_punctuation, "");
				

                if (_stopWords.test(word.toLowerCase())) {
                    return;
                }

                word = word.substr(0, maxLength);
				
                if(!word.length) {
                    return;
                }
				
				
				
				
                cases[word.toLowerCase()] = word;
                tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
            });

            tags = d3.entries(tags).sort(function(a, b) {
                return b.value - a.value;
            });

            tags.forEach(function(d) {d.key = cases[d.key]; });
        }



        // Patches to get cloud to play nice with dc
        _chart.filter = function(word) {
            if(word===null) {
                // A null filter is a shortcut for _chart.filterAll() in dc
                return _chart.filterAll();
            }
            if(word===undefined) {
                return false;
            }

            var _filters = _chart.filters(),
                _idx = -1;

            if((_idx=_filters.indexOf(word))<0) {
                // Doesn't have filter yet
                _filters.push(word);
            }else{
                // Has filter. Turn it off.
                _filters.splice(_idx, 1);
            }

            _selectedWords = _filters.join(", ");

            var _fs = "(";
            for(var f in _filters) {
                if(_fs.length>1) {
                    _fs+="|"
                }
                _fs += _filters[f].replace(/\s+/, _searchBreak);
            }
            _fs+=")";

            var re = RegExp(_fs, 'ig'),
                _f = function(r) { return re.test(r); };

            _chart.dimension().filterFunction(_f);

            _chart.turnOnControls();
            _chart._invokeFilteredListener(_chart, word);

            dc.redrawAll();
        }

        _chart.filterAll = function() {
            _chart.dimension().filterFunction(function(){
                return 1;
            });
            _chart.turnOffControls();
            dc.redrawAll(); 
            _chart._invokeFilteredListener(_chart, null);
        }

        _chart.turnOnControls = function () {
            _chart.selectAll(".reset")
                .style("display", null);
            _chart.selectAll(".filter")
                .text(_selectedWords)
                .style("display", null);

            return _chart;
        };



        // Make rendering and drawing available to dc.js
        _chart._doRender = function() {
            _chart.resetSvg();

            _g = _chart.svg();
            _fg = _g.append('g')
                    .attr('transform',
                          'translate('+ [_chart.cx(), _chart.cy()] +')');
            _bg = _g.append('g');

            drawChart();
            return _chart;
        };

        _chart._doRedraw = function() {
            drawChart();
            return _chart;
        };

        // Anchor the chart
        return _chart.anchor(parent, chartGroup);
    };

})(dc, d3);
//});