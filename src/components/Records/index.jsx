/* global API_HOST */
import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { getRecords } from 'actions';
import strings from 'lang';
import Table from 'components/Table';
import Heading from 'components/Heading';
import { transformations, formatSeconds } from 'utility';
// import { IconRadiant, IconDire, IconTrophy } from 'components/Icons';
import Container from 'components/Container';
import TabBar from 'components/TabBar';

const matchesColumns = field => [{
  displayName: '#',
  field: 'rank',
}, {
  displayName: strings[`th_${field}`],
  field: 'score',
  displayFn: (row, col, field) => (row.hero_id === '' ? formatSeconds(field) : Number(field).toLocaleString()),
}, {
  displayName: strings.th_match_id,
  field: 'match_id',
  displayFn: transformations.match_id_with_time,
}, {
  displayName: '',
  field: 'hero_id',
  displayFn: (row, col, field) => (row.hero_id === '' ? null : transformations.hero_id(row, col, field)),
}];

const fields = ['duration', 'kills', 'deaths', 'assists', 'gold_per_min', 'xp_per_min', 'last_hits', 'denies', 'hero_damage', 'tower_damage', 'hero_healing'];

const tabs = fields.map(field => ({
  name: strings[`th_${field}`],
  key: field,
  content: props => (<Container>
    <Table data={props.data.map((element, index) => ({ ...element, rank: index + 1 }))} columns={matchesColumns(field)} />
  </Container>),
  route: `/records/${field}`,
}));

const getData = (props) => {
  const route = props.routeParams.info || 'duration';
  props.dispatchRecords(route);
};

class RequestLayer extends React.Component {
  componentDidMount() {
    getData(this.props);
  }

  componentWillUpdate(nextProps) {
    if (this.props.routeParams.info !== nextProps.routeParams.info) {
      getData(nextProps);
    }
  }
  render() {
    const route = this.props.routeParams.info || 'duration';

    const tab = tabs.find(tab => tab.key === route);
    return (<div>
      <Helmet title={strings.heading_records} />
      <div>
        <Heading title={strings.heading_records} subtitle={strings.subheading_records} />
        <TabBar
          info={route}
          tabs={tabs}
        />
        {tab && tab.content(this.props)}
      </div>
    </div>);
  }
}

const mapStateToProps = state => ({
  data: state.app.records.list,
  loading: state.app.records.loading,
});

const mapDispatchToProps = dispatch => ({
  dispatchRecords: info => dispatch(getRecords(info)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RequestLayer);
