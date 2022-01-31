/**
   * Helper function for upperConvexHull, which itself is a helper
   * function for choosing initial guess of roots.
   */
 function cross(a, b, o) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  }

  /**
   * Upper convex hull helper function. For helping to choose initial guess.
   * This is Andrew's monotone chain convex hull algorithm (see e.g.
   * https://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain )
   * which works in O(n log n) time on a set of 2-d points. It is
   * dominated by the time complexity of sorting the points by the
   * first coordinate.
   */
  function upperConvexHull(points) {

    points.sort(function cmpX(a, b) { return a[0] - b[0]; });

    var upper = [];
    for (var i = 0; i < points.length; i++) {
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) >= 0) {
        upper.pop();
      }
      upper.push(points[i]);
    }

    return upper;

  }

  /**
   * Initial guess for roots. See Bini's paper (ref above) to
   * understand how this works.
   *
   * @param {Array<Object>} a polynomial coefficients
   * @returns {Object} TODO
   */
  function rootGuess(a) {
    var deg   = a.length - 1;

    /* Complex modulus (magnitude) of each coefficient */
    var amod  = a['map']( x => x['mod'] );

    /* logs of moduli; using Bini's magic number from netlib */
    var amlog = amod['map']( x => ((x!=0)?Math.log(x):-1.e+30) );

    /* compute upper convex hull of pairs {(i,log|a_i|)} */
    var pairs = amlog['map']( (x, i) => [i, x] );
    
    var hull  = upperConvexHull(pairs);
    var q     = hull.length;

    /* Remember that Bini's code is 1-indexed because FORTRAN.
     * What Bini calls the k_1, k_2, ... k_q are the x coordinates of
     * the array `hull`. In JS, though, we would refer to them as
     * k[0], k[1], ... k[q-1].
     */
    var k = hull['map']( x => x[0] );

    /* Finally, assemble all the root estimates */
    var x0 = new Array(deg);
    for (var i = 0; i < q-1; i++) {
      var deltaKInv = 1./(k[i+1] - k[i]);
      // This is the value Bini would call u_{k_{i+1}}
      var u = Math.pow( amod[ k[i] ]/amod[ k[i+1] ], deltaKInv);
      var sigma = 0.7; // Another magic number from Bini, but shouldn't matter
      var phi0 = 2.*Math.PI*(i+1)/deg + sigma;

      for (var j = 0; j < k[i+1] - k[i]; j++) {
        var phi = phi0 + 2.*Math.PI*j*deltaKInv;
        x0[ k[i] + j ] = Complex(0., phi)['exp']()['mul'](u);
      };
    };

    return x0;
  }