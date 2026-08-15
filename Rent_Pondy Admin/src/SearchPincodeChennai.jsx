import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Form, Button, Table, Modal, Spinner } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { chennaiPincodeRows, CHENNAI_DIRECTIONS } from './chennaiPincodes';
import PhoneCell from './components/PhoneCell';

// Direction → accent colour. Kept close to the Pondy page palette so
// staff don't have to mentally switch styles between the two screens.
const DIRECTION_COLOR = {
  Central: '#27AE60',
  North:   '#2E86C1',
  South:   '#AF7AC5',
  West:    '#E67E22',
};

const SearchPincodeChennai = () => {
  const navigate = useNavigate();
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [search, setSearch] = useState('');
  // Per-pincode approved-property counts for CH, fetched from the same
  // feed the Pondy SearchPincode page uses. The global axios interceptor
  // appends ?base=CH for CH admins so the response is already scoped.
  const [pincodeCounts, setPincodeCounts] = useState({});
  const [allProperties, setAllProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  // The area row currently drilled into; opens the property table modal.
  const [selectedArea, setSelectedArea] = useState(null);
  // Filter controls inside the property table modal — mirror the Pondy
  // page's Search Pincode controls.
  const [modeFilter, setModeFilter] = useState('');
  const [rentIdSearch, setRentIdSearch] = useState('');
  const [planTypeFilter, setPlanTypeFilter] = useState('');

  // Browser-back support for the drill: opening a level pushes a history
  // entry; hitting back closes the topmost level (area modal first, then
  // the direction view). Refs sidestep the stale-closure trap.
  const selectedDirectionRef = useRef(null);
  const selectedAreaRef = useRef(null);
  useEffect(() => { selectedDirectionRef.current = selectedDirection; }, [selectedDirection]);
  useEffect(() => { selectedAreaRef.current = selectedArea; }, [selectedArea]);
  useEffect(() => {
    const onPopState = () => {
      if (selectedAreaRef.current) {
        setSelectedArea(null);
      } else if (selectedDirectionRef.current) {
        setSelectedDirection(null);
        setSearch('');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const openDirection = (dir) => {
    window.history.pushState({ rpModal: 'chennai-direction' }, '');
    setSelectedDirection(dir);
    setSearch('');
  };
  const openArea = (row) => {
    window.history.pushState({ rpModal: 'chennai-area' }, '');
    setSelectedArea(row);
    setRentIdSearch('');
    setPlanTypeFilter('');
    setModeFilter('');
  };
  const closeDirection = () => { window.history.back(); };
  const closeArea = () => { window.history.back(); };

  useEffect(() => {
    let cancelled = false;
    const fetchCounts = async () => {
      setPropertiesLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/fetch-active-users-datas-all-rent`,
          { headers: { 'Cache-Control': 'no-cache' }, params: { _t: Date.now() } }
        );
        if (cancelled) return;
        const list = (res.data?.users || []).filter((p) => !p.isDeleted);
        setAllProperties(list);
        const counts = {};
        list.forEach((p) => {
          const pin = String(
            p.pinCode || p.pincode || p.postalCode || p.zipCode ||
            p.propertyPincode ||
            (p.address && (p.address.pincode || p.address.pinCode)) || ''
          ).trim();
          if (!pin) return;
          counts[pin] = (counts[pin] || 0) + 1;
        });
        setPincodeCounts(counts);
      } catch (err) {
        console.error('SearchPincodeChennai property fetch failed:', err);
      } finally {
        if (!cancelled) setPropertiesLoading(false);
      }
    };
    fetchCounts();
    return () => { cancelled = true; };
  }, []);

  // Build a per-direction map of unique pincodes → list of areas.
  // The Excel has 287 area rows; many share a pincode, so we collapse
  // them into one card per (direction, pincode).
  const groupedByDirection = useMemo(() => {
    const out = {};
    CHENNAI_DIRECTIONS.forEach((d) => { out[d] = new Map(); });

    chennaiPincodeRows.forEach((row) => {
      const dirMap = out[row.direction];
      if (!dirMap) return;
      if (!dirMap.has(row.pincode)) dirMap.set(row.pincode, []);
      dirMap.get(row.pincode).push(row.area);
    });

    const final = {};
    CHENNAI_DIRECTIONS.forEach((d) => {
      const arr = Array.from(out[d].entries()).map(([pincode, areas]) => ({
        pincode,
        areas: areas.sort((a, b) => a.localeCompare(b)),
      }));
      arr.sort((a, b) => a.pincode.localeCompare(b.pincode));
      final[d] = arr;
    });
    return final;
  }, []);

  // Pincodes for the direction currently drilled into, filtered by the
  // search term (matches pincode digits OR any area name).
  const filteredPincodes = useMemo(() => {
    if (!selectedDirection) return [];
    const rows = groupedByDirection[selectedDirection] || [];
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(({ pincode, areas }) =>
      pincode.includes(term) || areas.some((a) => a.toLowerCase().includes(term))
    );
  }, [groupedByDirection, selectedDirection, search]);

  const totals = useMemo(() => {
    const pinSet = new Set();
    chennaiPincodeRows.forEach((r) => pinSet.add(r.pincode));
    return { areas: chennaiPincodeRows.length, pincodes: pinSet.size };
  }, []);

  // Alphabetised full list of areas for the side panel, filtered by the
  // shared `search` term so the right panel honours the same input.
  const areaListAll = useMemo(
    () => [...chennaiPincodeRows].sort((a, b) => a.area.localeCompare(b.area)),
    []
  );
  const areaListFiltered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return areaListAll;
    return areaListAll.filter(
      (r) => r.area.toLowerCase().includes(term) || r.pincode.includes(term)
    );
  }, [areaListAll, search]);

  return (
    <Container fluid className="p-4">
      <div className="mb-3">
        <h2 style={{ margin: 0, fontWeight: 700 }}>📍 Pincode Property — Chennai</h2>
        <p style={{ color: '#666', margin: '4px 0 0 0' }}>
          {selectedDirection
            ? `Showing ${selectedDirection} Chennai pincodes.`
            : 'Pick a direction to see its pincodes.'}
        </p>
      </div>

      {/* Headline counters — always visible so staff have context. */}
      <Row className="g-3 mb-4">
        <Col md={3} sm={6} xs={6}>
          <Card style={{ borderRadius: 12, border: '1px solid #e0e0e0' }}>
            <Card.Body className="text-center">
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totals.pincodes}</div>
              <div style={{ color: '#666', fontSize: 13 }}>Total Pincodes</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={6}>
          <Card style={{ borderRadius: 12, border: '1px solid #e0e0e0' }}>
            <Card.Body className="text-center">
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{totals.areas}</div>
              <div style={{ color: '#666', fontSize: 13 }}>Total Areas Covered</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={6}>
          <Card style={{ borderRadius: 12, border: '1px solid #e0e0e0' }}>
            <Card.Body className="text-center">
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{CHENNAI_DIRECTIONS.length}</div>
              <div style={{ color: '#666', fontSize: 13 }}>Directions</div>
            </Card.Body>
          </Card>
        </Col>
        {selectedDirection && (
          <Col md={3} sm={6} xs={6}>
            <Card style={{ borderRadius: 12, border: `1px solid ${DIRECTION_COLOR[selectedDirection]}55` }}>
              <Card.Body className="text-center">
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: DIRECTION_COLOR[selectedDirection] }}>
                  {groupedByDirection[selectedDirection].length}
                </div>
                <div style={{ color: '#666', fontSize: 13 }}>{selectedDirection} Chennai pincodes</div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {!selectedDirection && (
        <Row className="g-4">
          {/* ── Left: pick a direction (2×2 grid) ── */}
          <Col xl={7} lg={7} md={12}>
            <h5 className="mb-3">🧭 Choose a direction</h5>
            <Row className="g-3">
              {CHENNAI_DIRECTIONS.map((dir) => {
                const color = DIRECTION_COLOR[dir];
                const count = groupedByDirection[dir].length;
                return (
                  <Col md={6} sm={6} xs={12} key={dir}>
                    <Card
                      role="button"
                      onClick={() => openDirection(dir)}
                      style={{
                        cursor: 'pointer',
                        border: `2px solid ${color}`,
                        borderRadius: 14,
                        boxShadow: `0 4px 18px ${color}33`,
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = `0 8px 24px ${color}55`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 18px ${color}33`;
                      }}
                    >
                      <Card.Body className="text-center p-4">
                        <div style={{ fontSize: '2.4rem', fontWeight: 800, color, lineHeight: 1 }}>
                          {count}
                        </div>
                        <div style={{
                          marginTop: 6,
                          fontSize: 13,
                          color: '#666',
                          textTransform: 'uppercase',
                          letterSpacing: 1.2,
                        }}>
                          pincodes
                        </div>
                        <div style={{ marginTop: 14, fontSize: '1.4rem', fontWeight: 700, color: '#222' }}>
                          {dir} Chennai
                        </div>
                        <div style={{
                          marginTop: 10,
                          display: 'inline-block',
                          padding: '4px 14px',
                          borderRadius: 999,
                          background: `${color}18`,
                          color,
                          fontSize: 12,
                          fontWeight: 600,
                        }}>
                          Click to view
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>

          {/* ── Right: full area list ── */}
          <Col xl={5} lg={5} md={12}>
            <Card style={{ borderRadius: 14, border: '1px solid #e0e0e0', height: '100%' }}>
              <Card.Body className="p-3 d-flex flex-column" style={{ minHeight: 480 }}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="m-0">📋 All Areas</h5>
                  <span style={{ color: '#666', fontSize: 13 }}>
                    {areaListFiltered.length} of {chennaiPincodeRows.length}
                  </span>
                </div>
                <Form.Control
                  type="search"
                  placeholder="Search by area or pincode…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-2"
                />
                <div
                  style={{
                    overflowY: 'auto',
                    flex: 1,
                    border: '1px solid #eee',
                    borderRadius: 8,
                    background: '#fafafa',
                  }}
                >
                  {areaListFiltered.length === 0 ? (
                    <div className="text-muted text-center p-4">No matches.</div>
                  ) : (
                    areaListFiltered.map((row, idx) => {
                      const color = DIRECTION_COLOR[row.direction];
                      return (
                        <div
                          key={`${row.area}-${row.pincode}-${idx}`}
                          className="d-flex align-items-center justify-content-between px-3 py-2"
                          style={{
                            borderBottom: idx === areaListFiltered.length - 1 ? 'none' : '1px solid #eee',
                            background: idx % 2 === 0 ? '#fff' : '#fafafa',
                          }}
                        >
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>
                              {row.area}
                            </div>
                            <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
                              {row.pincode}
                            </div>
                          </div>
                          <span
                            role="button"
                            onClick={() => openDirection(row.direction)}
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 10px',
                              borderRadius: 999,
                              background: `${color}18`,
                              color,
                              cursor: 'pointer',
                              flexShrink: 0,
                              marginLeft: 8,
                            }}
                            title={`Open ${row.direction} pincodes`}
                          >
                            {row.direction}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {selectedDirection && (() => {
        const color = DIRECTION_COLOR[selectedDirection];
        // Every area belonging to the selected direction (alphabetised),
        // with the property count for its pincode rendered on the right.
        const areasInDirection = chennaiPincodeRows
          .filter((row) => row.direction === selectedDirection)
          .map((row) => ({
            area: row.area,
            pincode: row.pincode,
            count: pincodeCounts[row.pincode] || 0,
          }))
          .sort((a, b) => a.area.localeCompare(b.area));
        const term = search.trim().toLowerCase();
        const visibleAreas = term
          ? areasInDirection.filter(
              (r) => r.area.toLowerCase().includes(term) || r.pincode.includes(term)
            )
          : areasInDirection;
        const directionTotal = areasInDirection.reduce((s, r) => s + r.count, 0);

        return (
          <>
            {/* ── Step 2: area list for the picked direction ── */}
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => closeDirection()}
              >
                <FaArrowLeft className="me-1" /> Back to directions
              </Button>
              <h5
                className="m-0 px-3 py-1"
                style={{
                  background: `${color}15`,
                  color,
                  borderRadius: 999,
                  fontWeight: 700,
                  border: `1px solid ${color}44`,
                }}
              >
                {selectedDirection} Chennai — {areasInDirection.length} areas · {directionTotal} {directionTotal === 1 ? 'property' : 'properties'}
              </h5>
            </div>

            <Form.Control
              type="search"
              placeholder="Filter by area name or pincode…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-3"
              style={{ maxWidth: 420 }}
            />

            {propertiesLoading && (
              <div className="text-muted mb-3" style={{ fontSize: 13 }}>
                <Spinner animation="border" size="sm" className="me-2" />
                Loading property counts…
              </div>
            )}

            {visibleAreas.length === 0 ? (
              <div className="alert alert-info">
                No areas match "{search}".
              </div>
            ) : (
              <div
                style={{
                  border: '1px solid #eee',
                  borderRadius: 10,
                  background: '#fff',
                  overflow: 'hidden',
                }}
              >
                {visibleAreas.map((row, idx) => {
                  const clickable = row.count > 0;
                  return (
                    <div
                      key={`${row.area}-${row.pincode}-${idx}`}
                      onClick={() => {
                        if (!clickable) return;
                        openArea(row);
                      }}
                      className="d-flex align-items-center justify-content-between px-3 py-2"
                      style={{
                        borderBottom: idx === visibleAreas.length - 1 ? 'none' : '1px solid #eee',
                        background: idx % 2 === 0 ? '#fff' : '#fafafa',
                        cursor: clickable ? 'pointer' : 'default',
                        opacity: clickable ? 1 : 0.65,
                      }}
                      title={clickable ? `View properties for ${row.area}` : 'No properties for this area yet'}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>
                          {row.area}
                        </div>
                        <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
                          {row.pincode}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          padding: '4px 12px',
                          borderRadius: 999,
                          background: clickable ? color : '#bbb',
                          color: '#fff',
                          flexShrink: 0,
                          marginLeft: 8,
                          minWidth: 36,
                          textAlign: 'center',
                        }}
                      >
                        {row.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      })()}

      {/* ── Step 3: property table for the picked area ── */}
      {selectedArea && (() => {
        const matches = allProperties.filter((p) => {
          const pin = String(
            p.pinCode || p.pincode || p.postalCode || p.zipCode ||
            p.propertyPincode ||
            (p.address && (p.address.pincode || p.address.pinCode)) || ''
          ).trim();
          if (pin !== selectedArea.pincode) return false;
          if (modeFilter && String(p.propertyMode || '').toLowerCase() !== modeFilter.toLowerCase()) return false;
          if (planTypeFilter) {
            const planType = (p.planType || p.plan || '').toString().toLowerCase();
            if (planType !== planTypeFilter.toLowerCase()) return false;
          }
          if (rentIdSearch) {
            const needle = rentIdSearch.trim().toLowerCase();
            if (!String(p.rentId || '').toLowerCase().includes(needle)) return false;
          }
          return true;
        });
        const color = DIRECTION_COLOR[selectedDirection] || '#27AE60';
        return (
          <Modal
            show={!!selectedArea}
            onHide={() => closeArea()}
            size="xl"
            centered
            scrollable
          >
            <Modal.Header closeButton style={{ background: `linear-gradient(135deg, ${color} 0%, #2c5364 100%)`, color: '#fff' }}>
              <Modal.Title style={{ color: '#fff' }}>
                📍 {selectedArea.area} <small style={{ opacity: 0.85 }}>({selectedArea.pincode})</small>
                <div style={{ fontSize: 13, fontWeight: 400, opacity: 0.95 }}>
                  {matches.length} {matches.length === 1 ? 'property' : 'properties'} · {selectedDirection} Chennai
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search by Rent ID"
                  style={{ width: 180 }}
                  value={rentIdSearch}
                  onChange={(e) => setRentIdSearch(e.target.value)}
                />
                <label className="m-0" style={{ fontWeight: 600 }}>Plan:</label>
                <Form.Select
                  style={{ width: 120 }}
                  value={planTypeFilter}
                  onChange={(e) => setPlanTypeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Free">Free</option>
                  <option value="Paid">Paid</option>
                </Form.Select>
                <label className="m-0" style={{ fontWeight: 600 }}>Mode:</label>
                <Form.Select
                  style={{ width: 150 }}
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </Form.Select>
              </div>

              {matches.length === 0 ? (
                <div className="alert alert-info text-center mb-0">
                  No approved properties found for {selectedArea.area} ({selectedArea.pincode}).
                </div>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>S.No</th><th>Rent ID</th><th>Phone</th><th>Property Type</th><th>Mode</th>
                        <th>BHK</th><th>Floor</th><th>Area</th><th>City</th><th>Rental Amount</th>
                        <th>Plan Type</th><th>Status</th><th>Created</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((p, idx) => (
                        <tr key={p.rentId || p._id || idx}>
                          <td>{idx + 1}</td>
                          <td
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              navigate('/dashboard/detail', {
                                state: { rentId: p.rentId, phoneNumber: p.phoneNumber },
                              })
                            }
                          >
                            <strong style={{ color: '#007bff', textDecoration: 'underline' }}>
                              {p.rentId || 'N/A'}
                            </strong>
                          </td>
                          <td><PhoneCell phone={p.phoneNumber} type="owner" rentId={p.rentId} /></td>
                          <td>{p.propertyType || 'N/A'}</td>
                          <td>{p.propertyMode || 'N/A'}</td>
                          <td>{p.bedrooms || p.bhk || 'N/A'}</td>
                          <td>{p.floorNo || p.floor || 'N/A'}</td>
                          <td>{p.area || 'N/A'}</td>
                          <td>{p.city || 'N/A'}</td>
                          <td>₹ {p.rentalAmount || 'N/A'}</td>
                          <td>{p.planType || p.plan || 'N/A'}</td>
                          <td>{p.status || 'N/A'}</td>
                          <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                          <td>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                navigate('/dashboard/detail', {
                                  state: { rentId: p.rentId, phoneNumber: p.phoneNumber },
                                })
                              }
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Modal.Body>
          </Modal>
        );
      })()}
    </Container>
  );
};

export default SearchPincodeChennai;
