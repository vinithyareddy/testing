<!--workforce - supply - widget.component.html-- >
  <div class="workforce-widget-container" >
    <!--Header Section-- >
      <div class="widget-header" >
        <div class="header-left" >
          <div class="icon-container" >
            <i class="fas fa-users" > </i>
              </div>
              < div class="menu-icon" >
                <i class="fas fa-bars" > </i>
                  </>
                  </div>
                  < div class="header-right" >
                    <span class="view-more" > View More </span>
                      < i class="fas fa-chevron-up" > </>
                        </div>
                        </div>

                        < !--Widget Content-- >
                          <div class="widget-content" >
                            <h3 class="widget-title" > Workforce Supply(FTE) by FCV Status </h3>

                              < div class="chart-section" >
                                <!--Chart Container-- >
                                  <div class="chart-wrapper" >
                                    <div #chartContainer class="chart-container" > </div>
                                      < !--Center Content-- >
                                        <div class="center-content" >
                                          <div class="total-number" > {{ chartData.total }}</div>
                                            < div class="total-label" > By FCV Status </>
                                              </div>
                                              </div>

                                              < !--Legend -->
                                                <div class="legend" >
                                                  <div class="legend-item" >
                                                    <span class="legend-dot fcv" > </span>
                                                      < span class="legend-text" > FCV </>
                                                        </div>
                                                        < div class="legend-item" >
                                                          <span class="legend-dot non-fcv" > </span>
                                                            < span class="legend-text" > Non - FCV </>
                                                              </div>
                                                              </div>
                                                              </div>

                                                              < !--Data Points-- >
                                                                <div class="data-points" >
                                                                  <div class="data-point" >
                                                                    <span class="percentage" > {{ chartData.fcvPercentage }}% </span>
                                                                      < span class="count" > ({{ chartData.fcvCount }})</>
                                                                        </div>
                                                                        < div class="data-point" >
                                                                          <span class="percentage" > {{ chartData.nonFcvPercentage }}% </span>
                                                                            < span class="count" > ({{ chartData.nonFcvCount }})</>
                                                                              </div>
                                                                              </div>
                                                                              </div>
                                                                              </div>