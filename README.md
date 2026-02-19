AVL Tree Visualizer 🌳 

	A fun place to play with AVL trees where you can see the inner workings in real time. The AVL Tree Playground is a visual AVL tree simulator that displays rotations and balancing in real-time. 

What This Actually Does 
	
	This little console application allows the user to self-balance the AVL tree by inserting numbers. Remember those geeks diagrams in your boring old textbook on data structures? 

Features That Actually Work 

	✅ **Insert nodes** - Enter a number, press insert and see the magic happen ✅ **Rotations** – left, right, left-right and right-left spin moves ✅ **Operation log** – A side panel that shows what rotation just happened (cause you will forget). ✅ **Undo button** – Because our brains aren’t perfect. ✅ **Clear all** – The nuclear option when you get too many things wrong ✅ **Setting animated background** – because who wants a boring background? ✅ “Height & Balance indicators” – Numbers below every node, speculating if you’re about to see a rotation out of nowhere. 

Usage 

		“Type a number” in the text box (Yes, it has to be a number. Letters won’t do. I tried.” Or, for the keyboard warriors, hit Enter. **See the balance appear in the tree yourself” (Animated Tree Balancing App, n.d., para. **Click “📋 Operation Log”** to see what rotations happened (spoiler: you’ll need this) Hit “Undo” if you suddenly regret your life choices (or just want to try out a different rotation strategy). **Clear All** when your sins weigh on your soul and another chance beckons (we’ve all been there). 

What's Under the Hood 

	**Pure JavaScript** – no frameworks, no libraries, no bloat **HTML5 Canvas** – for drawing nice looking circles and lines **CSS Gradients** - Enough gradients to fill a vaporwave album cover **AVL Tree Algorithm** – Computer science, for real (shocking, I know). 

The Honest Performance Section 
	
	**Small trees (< 20 nodes)**: Buttery smooth **Medium trees (20-50 nodes)**: Still okay **50+ nodes) Large trees**: Canvas looks like spaghetti, but it gets the job done **Massive trees (100+ nodes)**: Works, but a visual mess 

Known Issues (The Hall of Shame) 

	1. **Canvas size is fixed** – if your tree becomes too big, you will have to scroll. Deal with it. 2. **No tree search* – this is a visualizer, not a database 3. No delete operation (people usually don’t delete nodes on AVL visualizers, and it’s a pain to implement). 4. **Mobile support is “ok”** – it works but is not optimal. Use an actual computer. 5. **Timing of animations is hardcoded** – If you want slower/faster animations, you’ll have to change setTimeout values in the code yourself 

Why This Exists 

	Since I was learning AVL trees, and all the visualisers I’ve ever seen were either: - Ugly as sin - Didn’t show rotations - Required Java (for real?). - Behind a paywall (for a tree visualiser??) - Or, it was just horribly broken 

	So I made this. You’re welcome. 

What You Can Learn From This 

	- How AVL Trees Truly Maintain Balanced - The left and right rotations - The occurrences of double rotations - That balance factors are `height(left) – height(right)` - A canvas api in general (if you read the code) - That gradients are a necessity to improve anything 
