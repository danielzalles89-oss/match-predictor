name: Auto Results & Send Standings

on:
  schedule:
    # Run every 10 minutes during match days (Jun 11 - Jun 27)
    - cron: '*/10 * 11-27 6 *'
  workflow_dispatch:  # Allow manual trigger for testing

jobs:
  check-and-notify:
    runs-on: ubuntu-latest
    steps:
      - name: Check results and send standings
        run: |
          node --input-type=commonjs << 'NODEOF'
          const https = require('https');

          // ── CONFIG ──────────────────────────────────────────────
          const FOOTBALL_API_KEY  = 'd031590eb4d440b397b6fe6a909e1d6c';
          const FIREBASE_PROJECT  = 'wc-quiniela-4d474';
          const FIREBASE_API_KEY  = 'AIzaSyAE_GXAmfPbKtQsHRVZl28zitk3oYHfSWI';
          const EMAILJS_SERVICE   = 'dzalles@iterla.com';
          const EMAILJS_TEMPLATE  = 'template_33yasn5';
          const EMAILJS_KEY       = '3RspfC0a9VWZeVpzQ';
          const APP_URL           = 'https://match-predictor-khaki.vercel.app';
          const WC2026_ID         = 2000; // football-data.org WC 2026 competition ID

          const PLAYERS = [
            { id: 'aarias_iterla_com',    name: 'Ana Arias',           email: 'aarias@iterla.com'    },
            { id: 'dzalles_iterla_com',   name: 'Daniel Zalles',       email: 'dzalles@iterla.com'   },
            { id: 'igarcia_iterla_com',   name: 'Ihorliss Garcia',     email: 'igarcia@iterla.com'   },
            { id: 'jtorm_iterla_com',     name: 'Juan Francisco Torm', email: 'jtorm@iterla.com'     },
            { id: 'laizpurua_iterla_com', name: 'Leticia Aizpurua',    email: 'laizpurua@iterla.com' },
            { id: 'nsantos_iterla_com',   name: 'Nilka Santos',        email: 'nsantos@iterla.com'   },
            { id: 'ydelacruz_iterla_com', name: 'Yodalys De La Cruz',  email: 'ydelacruz@iterla.com' },
          ];

          // Match ID mapping: football-data.org match ID -> our game ID
          // We match by teams since IDs may differ
          const ALL_MATCHES = [
            { id:'G1',  home:'Mexico',        away:'South Africa'   },
            { id:'G2',  home:'South Korea',   away:'Czechia'        },
            { id:'G3',  home:'Canada',        away:'Bosnia & Herz.' },
            { id:'G4',  home:'USA',           away:'Paraguay'       },
            { id:'G5',  home:'Qatar',         away:'Switzerland'    },
            { id:'G6',  home:'Brazil',        away:'Morocco'        },
            { id:'G7',  home:'Haiti',         away:'Scotland'       },
            { id:'G8',  home:'Australia',     away:'Turkey'         },
            { id:'G9',  home:'Germany',       away:'Curacao'        },
            { id:'G10', home:'Netherlands',   away:'Japan'          },
            { id:'G11', home:'Ivory Coast',   away:'Ecuador'        },
            { id:'G12', home:'Sweden',        away:'Tunisia'        },
            { id:'G13', home:'Spain',         away:'Cape Verde'     },
            { id:'G14', home:'Belgium',       away:'Egypt'          },
            { id:'G15', home:'Saudi Arabia',  away:'Uruguay'        },
            { id:'G16', home:'Iran',          away:'New Zealand'    },
            { id:'G17', home:'France',        away:'Senegal'        },
            { id:'G18', home:'Iraq',          away:'Norway'         },
            { id:'G19', home:'Argentina',     away:'Algeria'        },
            { id:'G20', home:'Austria',       away:'Jordan'         },
            { id:'G21', home:'Portugal',      away:'DR Congo'       },
            { id:'G22', home:'Uzbekistan',    away:'Colombia'       },
            { id:'G23', home:'England',       away:'Panama'         },
            { id:'G24', home:'Ghana',         away:'Croatia'        },
            { id:'G25', home:'Mexico',        away:'South Korea'    },
            { id:'G26', home:'Czechia',       away:'South Africa'   },
            { id:'G27', home:'Switzerland',   away:'Bosnia & Herz.' },
            { id:'G28', home:'Canada',        away:'Qatar'          },
            { id:'G29', home:'USA',           away:'Australia'      },
            { id:'G30', home:'Turkey',        away:'Paraguay'       },
            { id:'G31', home:'Morocco',       away:'Haiti'          },
            { id:'G32', home:'Brazil',        away:'Scotland'       },
            { id:'G33', home:'Germany',       away:'Ivory Coast'    },
            { id:'G34', home:'Ecuador',       away:'Curacao'        },
            { id:'G35', home:'Netherlands',   away:'Sweden'         },
            { id:'G36', home:'Japan',         away:'Tunisia'        },
            { id:'G37', home:'Belgium',       away:'Iran'           },
            { id:'G38', home:'New Zealand',   away:'Egypt'          },
            { id:'G39', home:'Spain',         away:'Saudi Arabia'   },
            { id:'G40', home:'Uruguay',       away:'Cape Verde'     },
            { id:'G41', home:'Argentina',     away:'Austria'        },
            { id:'G42', home:'Jordan',        away:'Algeria'        },
            { id:'G43', home:'France',        away:'Iraq'           },
            { id:'G44', home:'Norway',        away:'Senegal'        },
            { id:'G45', home:'Portugal',      away:'Uzbekistan'     },
            { id:'G46', home:'Colombia',      away:'DR Congo'       },
            { id:'G47', home:'England',       away:'Ghana'          },
            { id:'G48', home:'Croatia',       away:'Panama'         },
            { id:'G49', home:'South Korea',   away:'South Africa'   },
            { id:'G50', home:'Mexico',        away:'Czechia'        },
            { id:'G51', home:'Bosnia & Herz.',away:'Qatar'          },
            { id:'G52', home:'Switzerland',   away:'Canada'         },
            { id:'G53', home:'Scotland',      away:'Morocco'        },
            { id:'G54', home:'Haiti',         away:'Brazil'         },
            { id:'G55', home:'Paraguay',      away:'Australia'      },
            { id:'G56', home:'Turkey',        away:'USA'            },
            { id:'G57', home:'Curacao',       away:'Germany'        },
            { id:'G58', home:'Ecuador',       away:'Ivory Coast'    },
            { id:'G59', home:'Tunisia',       away:'Netherlands'    },
            { id:'G60', home:'Sweden',        away:'Japan'          },
            { id:'G61', home:'Norway',        away:'France'         },
            { id:'G62', home:'Senegal',       away:'Iraq'           },
            { id:'G63', home:'Cape Verde',    away:'Saudi Arabia'   },
            { id:'G64', home:'Uruguay',       away:'Spain'          },
            { id:'G65', home:'Egypt',         away:'Iran'           },
            { id:'G66', home:'New Zealand',   away:'Belgium'        },
            { id:'G67', home:'Panama',        away:'England'        },
            { id:'G68', home:'Croatia',       away:'Ghana'          },
            { id:'G69', home:'Colombia',      away:'Portugal'       },
            { id:'G70', home:'DR Congo',      away:'Uzbekistan'     },
            { id:'G71', home:'Algeria',       away:'Austria'        },
            { id:'G72', home:'Jordan',        away:'Argentina'      },
          ];

          // ── HELPERS ──────────────────────────────────────────────
          function apiRequest(hostname, path, headers) {
            return new Promise((resolve, reject) => {
              const options = { hostname, path, method: 'GET', headers: headers||{} };
              const req = https.request(options, res => {
                let data = '';
                res.on('data', c => data += c);
                res.on('end', () => {
                  try { resolve(JSON.parse(data)); }
                  catch(e) { reject(new Error('Parse error: ' + data.slice(0,200))); }
                });
              });
              req.on('error', reject);
              req.end();
            });
          }

          function firestoreGet(collection, docId) {
            const path = docId
              ? '/v1/projects/' + FIREBASE_PROJECT + '/databases/(default)/documents/' + collection + '/' + docId + '?key=' + FIREBASE_API_KEY
              : '/v1/projects/' + FIREBASE_PROJECT + '/databases/(default)/documents/' + collection + '?key=' + FIREBASE_API_KEY + '&pageSize=200';
            return apiRequest('firestore.googleapis.com', path);
          }

          function firestorePatch(collection, docId, fields) {
            return new Promise((resolve, reject) => {
              const body = JSON.stringify({ fields });
              const path = '/v1/projects/' + FIREBASE_PROJECT + '/databases/(default)/documents/' + collection + '/' + docId + '?key=' + FIREBASE_API_KEY;
              const req = https.request({
                hostname: 'firestore.googleapis.com',
                path, method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
              }, res => {
                let d = ''; res.on('data', c => d+=c);
                res.on('end', () => resolve(d));
              });
              req.on('error', reject);
              req.write(body); req.end();
            });
          }

          function fsVal(v) {
            if (typeof v === 'string') return { stringValue: v };
            if (typeof v === 'number') return { integerValue: String(v) };
            return { stringValue: String(v) };
          }

          function fromFs(field) {
            if (!field) return '';
            if (field.stringValue !== undefined) return field.stringValue;
            if (field.integerValue !== undefined) return field.integerValue;
            if (field.mapValue) {
              const r = {};
              for (const [k,v] of Object.entries(field.mapValue.fields||{})) r[k] = fromFs(v);
              return r;
            }
            return '';
          }

          function calcScore(pred, actual) {
            if (!actual||actual.h===''||actual.a==='') return 0;
            if (!pred||pred.h===''||pred.a==='') return 0;
            const ph=Number(pred.h),pa=Number(pred.a),ah=Number(actual.h),aa=Number(actual.a);
            if (isNaN(ph)||isNaN(pa)||isNaN(ah)||isNaN(aa)) return 0;
            return (ph===ah&&pa===aa) ? 1 : 0;
          }

          function calcQuinielaScore(pred, actual) {
            if (!actual||actual.h===''||actual.a==='') return 0;
            if (!pred||pred.h===''||pred.a==='') return 0;
            const ph=Number(pred.h),pa=Number(pred.a),ah=Number(actual.h),aa=Number(actual.a);
            if (isNaN(ph)||isNaN(pa)||isNaN(ah)||isNaN(aa)) return 0;
            let pts=0;
            const pw=ph>pa?'h':ph<pa?'a':'d', aw=ah>aa?'h':ah<aa?'a':'d';
            if (pw===aw) pts+=10;
            if (ph===ah) pts+=3;
            if (pa===aa) pts+=3;
            if ((ph-pa)===(ah-aa)) pts+=4;
            return pts;
          }

          function sendEmail(player, subject, htmlBody) {
            return new Promise((resolve, reject) => {
              const body = JSON.stringify({
                service_id: EMAILJS_SERVICE,
                template_id: EMAILJS_TEMPLATE,
                user_id: EMAILJS_KEY,
                template_params: {
                  to_email: player.email,
                  email: player.email,
                  subject,
                  message: htmlBody,
                }
              });
              const req = https.request({
                hostname: 'api.emailjs.com',
                path: '/api/v1.0/email/send',
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': Buffer.byteLength(body),
                  'origin': APP_URL,
                }
              }, res => {
                let d=''; res.on('data',c=>d+=c);
                res.on('end',()=>{ res.statusCode===200?resolve():reject(new Error(d)); });
              });
              req.on('error', reject);
              req.write(body); req.end();
            });
          }

          // ── MAIN ────────────────────────────────────────────────
          (async () => {
            console.log('Starting auto-results check...');

            // 1. Get finished matches from football-data.org
            let apiMatches;
            try {
              const res = await apiRequest(
                'api.football-data.org',
                '/v4/competitions/WC/matches?season=2026&status=FINISHED',
                { 'X-Auth-Token': FOOTBALL_API_KEY }
              );
              apiMatches = res.matches || [];
              console.log('API matches finished:', apiMatches.length);
            } catch(e) {
              console.error('Football API error:', e.message);
              process.exit(1);
            }

            if (apiMatches.length === 0) {
              console.log('No finished matches yet.');
              process.exit(0);
            }

            // 2. Get current actuals from Firebase
            let currentActuals = {};
            try {
              const snap = await firestoreGet('actuals', 'results');
              if (snap.fields) {
                for (const [k, v] of Object.entries(snap.fields)) {
                  currentActuals[k] = fromFs(v);
                }
              }
            } catch(e) {
              console.log('No existing actuals, starting fresh.');
            }

            // 3. Match API results to our game IDs
            let newResults = false;
            const updatedActuals = { ...currentActuals };

            for (const match of apiMatches) {
              if (match.status !== 'FINISHED') continue;
              const homeTeam = match.homeTeam.name;
              const awayTeam = match.awayTeam.name;
              const homeGoals = match.score.fullTime.home;
              const awayGoals = match.score.fullTime.away;

              // Find matching game in our list (fuzzy match on team names)
              const game = ALL_MATCHES.find(g => {
                const hMatch = homeTeam.toLowerCase().includes(g.home.toLowerCase().split(' ')[0].toLowerCase()) ||
                               g.home.toLowerCase().includes(homeTeam.toLowerCase().split(' ')[0].toLowerCase());
                const aMatch = awayTeam.toLowerCase().includes(g.away.toLowerCase().split(' ')[0].toLowerCase()) ||
                               g.away.toLowerCase().includes(awayTeam.toLowerCase().split(' ')[0].toLowerCase());
                return hMatch && aMatch;
              });

              if (!game) {
                console.log('Could not match:', homeTeam, 'vs', awayTeam);
                continue;
              }

              const existing = currentActuals[game.id];
              const newH = String(homeGoals);
              const newA = String(awayGoals);

              // Only update if result is new or changed
              if (!existing || existing.h !== newH || existing.a !== newA) {
                console.log('New result:', game.id, homeTeam, newH, '-', newA, awayTeam);
                updatedActuals[game.id] = { h: newH, a: newA };
                newResults = true;
              }
            }

            // 4. Save updated results to Firebase
            if (newResults) {
              console.log('Saving new results to Firebase...');
              const fields = {};
              for (const [gameId, score] of Object.entries(updatedActuals)) {
                fields[gameId] = { mapValue: { fields: { h: fsVal(score.h), a: fsVal(score.a) } } };
              }
              await firestorePatch('actuals', 'results', fields);
              console.log('Results saved!');
            } else {
              console.log('No new results — skipping email.');
              process.exit(0);
            }

            // 5. Load all predictions for standings
            console.log('Loading predictions for standings...');

            // Match Predictor predictions
            let mpPreds = {};
            try {
              const snap = await firestoreGet('match_predictions');
              for (const doc of (snap.documents||[])) {
                const id = doc.name.split('/').pop();
                mpPreds[id] = {};
                for (const [k,v] of Object.entries(doc.fields||{})) {
                  mpPreds[id][k] = fromFs(v);
                }
              }
            } catch(e) { console.error('MP preds error:', e.message); }

            // 6. For each newly finished match, find MP winner + send email
            // Get list of newly finished games
            const newlyFinished = [];
            for (const [gameId, score] of Object.entries(updatedActuals)) {
              const existing = currentActuals[gameId];
              if (!existing || existing.h !== score.h || existing.a !== score.a) {
                const match = ALL_MATCHES.find(m => m.id === gameId);
                if (match) newlyFinished.push({ ...match, score });
              }
            }

            // 7. Calculate Excel Quiniela standings (full, for all results)
            let excelPreds = {};
            try {
              const snap = await firestoreGet('excel_quiniela');
              for (const doc of (snap.documents||[])) {
                const data = {};
                for (const [k,v] of Object.entries(doc.fields||{})) {
                  data[k] = fromFs(v);
                }
                const email = data.email;
                if (!excelPreds[email]) excelPreds[email] = [];
                excelPreds[email].push({ name: data.name, preds: data.predictions||{} });
              }
            } catch(e) { console.error('Excel preds error:', e.message); }

            const excelStandings = [];
            for (const [email, entries] of Object.entries(excelPreds)) {
              for (const entry of entries) {
                let total=0;
                for (const m of ALL_MATCHES) {
                  const actual = updatedActuals[m.id];
                  const pred = entry.preds[m.id];
                  if (pred) total += calcQuinielaScore({h:String(pred.h||''),a:String(pred.a||'')}, actual||{});
                }
                excelStandings.push({ email, name: entry.name, total });
              }
            }
            excelStandings.sort((a,b)=>b.total-a.total);

            const medals = ['🥇','🥈','🥉'];
            const excelRows = excelStandings.map((p,i) =>
              '<tr style=\"border-bottom:1px solid #1a3080\">' +
              '<td style=\"padding:10px 14px;color:#f0f8ff;font-weight:700\">' + (medals[i]||('#'+(i+1))) + ' ' + p.name + '</td>' +
              '<td style=\"padding:10px 14px;text-align:center;color:#f5c842;font-weight:900;font-size:18px\">' + p.total + '</td>' +
              '</tr>'
            ).join('');

            // 8. Send one email per newly finished match
            for (const match of newlyFinished) {
              const { id, home, away, score } = match;

              // Find MP winners for this match
              const winners = [];
              const participants = [];
              for (const player of PLAYERS) {
                const pred = mpPreds[id + '_' + player.id];
                if (pred && pred.h !== '' && pred.a !== '') {
                  participants.push({ ...player, pred });
                  if (calcScore({h:pred.h,a:pred.a}, score) === 1) {
                    winners.push({ ...player, pred });
                  }
                }
              }

              // Build winner section
              let winnerSection = '';
              if (winners.length === 0) {
                winnerSection =
                  '<div style=\"background:#1a0a0a;border:1px solid #3a1a1a;border-radius:10px;padding:14px 16px;margin-bottom:24px\">' +
                  '<div style=\"color:#e74c3c;font-weight:800;font-size:15px\">😬 No one predicted the exact score</div>' +
                  '</div>';
              } else {
                const winnerCards = winners.map(w =>
                  '<div style=\"display:inline-block;background:#f5c84222;border:1px solid #f5c842;border-radius:20px;padding:6px 16px;margin:4px\">' +
                  '<span style=\"color:#f5c842;font-weight:900\">🏆 ' + w.name + '</span>' +
                  '<span style=\"color:#f5c842;opacity:0.8;margin-left:8px;font-family:monospace\">' + w.pred.h + ':' + w.pred.a + '</span>' +
                  '</div>'
                ).join('');
                winnerSection =
                  '<div style=\"background:#1a1a00;border:1px solid #f5c84255;border-radius:10px;padding:14px 16px;margin-bottom:24px\">' +
                  '<div style=\"color:#f5c842;font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px\">🎯 Winner' + (winners.length>1?'s':'') + '</div>' +
                  winnerCards +
                  '</div>';
              }

              // Build all predictions section
              const predRows = participants.map(p => {
                const isWinner = winners.find(w => w.id === p.id);
                return '<div style=\"display:inline-block;background:' + (isWinner?'#f5c84222':'#1a0a0a') + ';border:1px solid ' + (isWinner?'#f5c842':'#3a1a1a') + ';border-radius:10px;padding:5px 12px;margin:3px\">' +
                  '<span style=\"color:' + (isWinner?'#f5c842':'#e74c3c') + ';font-size:13px;font-weight:700\">' + p.name + '</span>' +
                  '<span style=\"color:' + (isWinner?'#f5c842':'#4a4a7a') + ';font-family:monospace;margin-left:6px\">' + p.pred.h + ':' + p.pred.a + '</span>' +
                  (isWinner ? '<span style=\"margin-left:4px\">🎯</span>' : '') +
                  '</div>';
              }).join('');

              const htmlBody =
                '<div style=\"font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#001254;color:#f0f8ff;padding:24px;border-radius:12px\">' +

                // Match result header
                '<div style=\"text-align:center;background:#0a1f6e;border-radius:12px;padding:20px;margin-bottom:20px;border:1px solid #1a3080\">' +
                '<div style=\"color:#83BAB5;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px\">Final Result</div>' +
                '<div style=\"font-size:22px;font-weight:900;color:#f0f8ff\">' + home + ' <span style=\"color:#f5c842;font-family:monospace;font-size:28px\">' + score.h + ' - ' + score.a + '</span> ' + away + '</div>' +
                '</div>' +

                // Match Predictor winner
                '<h3 style=\"color:#20B2AA;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 10px\">🎯 Match Predictor</h3>' +
                winnerSection +

                // All predictions
                (participants.length > 0 ?
                  '<div style=\"margin-bottom:24px\"><div style=\"color:#83BAB5;font-size:11px;margin-bottom:8px;text-transform:uppercase;letter-spacing:1px\">' + participants.length + ' predictions</div>' +
                  predRows + '</div>' : '') +

                // Only show Excel Quiniela standings if there ARE winners
                (winners.length > 0 ?
                  '<h3 style=\"color:#f5c842;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px\">📊 Quiniela Excel — Updated Standings</h3>' +
                  '<table style=\"width:100%;border-collapse:collapse;background:#0a1f6e;border-radius:10px;overflow:hidden;margin-bottom:16px\">' +
                  '<thead><tr style=\"background:#002171\">' +
                  '<th style=\"padding:10px 14px;text-align:left;color:#83BAB5;font-size:11px;text-transform:uppercase\">Player</th>' +
                  '<th style=\"padding:10px 14px;text-align:center;color:#83BAB5;font-size:11px;text-transform:uppercase\">Points</th>' +
                  '</tr></thead><tbody>' + excelRows + '</tbody></table>'
                  : '') +

                '<p style=\"color:#4a7a8a;font-size:11px\">Zalles WC 2026 · Auto-updated after each match</p>' +
                '</div>';

              const subject = '⚽ ' + home + ' ' + score.h + '-' + score.a + ' ' + away + ' — WC 2026 Results';

              console.log('Sending email for', id, ':', home, score.h, '-', score.a, away);
              let sent=0, failed=0;
              for (const player of PLAYERS) {
                try {
                  await sendEmail(player, subject, htmlBody);
                  sent++;
                  await new Promise(r => setTimeout(r, 500));
                } catch(e) {
                  console.error('Failed for', player.email, e.message);
                  failed++;
                }
              }
              console.log('Match', id, '— Sent:', sent, 'Failed:', failed);
            }
            console.log('All done!');
          })();
          "
