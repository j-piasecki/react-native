import { tweets as tweetsData } from './tweets';
import TweetCell from './TweetCell';
import {
  RecyclerView,
} from './RecyclerView';
import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ViewabilityConfig,
} from 'react-native';

export function render() {
  return <Test />;
  // return <Twitter />;
}

const colors = ['red', 'green', 'blue'];

function Item(props) {
  const [expanded, setExpanded] = useState(false);
  const viewRef = useRef(null);
console.log('Item render', props.index);
queueMicrotask(() => console.log('Item render microtask', props.index));
  useLayoutEffect(() => {
    queueMicrotask(() => console.log('Item layoyt microtask', props.index));
    viewRef.current.measureLayout(viewRef.current, (x, y, width, height) => {
      props.setSize(props.index, height);
      console.log('useLayoutEffect measure', props.index);
    });
    console.log('useLayoutEffect', props.index);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      queueMicrotask(() => console.log('Item mutation microtask', props.index));
      console.log('MutationObserver', props.index);
      viewRef.current.measureLayout(viewRef.current, (x, y, width, height) => {
        props.setSize(props.index, height);
        console.log('update ref to', height, props.index);
      });
    });

    observer.observe(viewRef.current, {
      subtree: true,
      childList: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  let now = performance.now();
  while (performance.now() - now < 100) {
    // Do nothing for a bit...
  }

  return (
    <Pressable onPress={() => setExpanded(!expanded)}>
      <View ref={viewRef} style={{height: expanded ? 100 : 50, backgroundColor: props.color, position: 'absolute', top: props.position, left: 0, right: 0, opacity: 0.5}}>
        {expanded && <Text>Expanded</Text>}
        </View>
    </Pressable>
  );
}

function Test() {
  const [sizes, setSizes] = useState([]);
  const [positions, setPositions] = useState([]);

  function updatePositions(sizes) {
    const newPositions = [];
    let current = 0;
    for (let i = 0; i < sizes.length; i++) {
      newPositions.push(current);
      current += sizes[i] || 0;
    }
    setPositions(newPositions);
  }

  useLayoutEffect(() => {
    updatePositions(sizes);
  }, [sizes]);

  function setSize(index, size) {
    setSizes((prev) => {
      const newSizes = [...prev];
      newSizes[index] = size;
      return newSizes;
    });

    setPositions((prev) => {
      const newPositions = [...prev];
      for (let i = index + 1; i < newPositions.length; i++) {
        newPositions[i] += size - sizes[index];
      }
      return newPositions;
    });
  }

console.log('Test render', positions);

  return (
    <SafeAreaView style={{flex: 1}}>
      {colors.map((color, index) => (
        <Item key={index} color={color} index={index} setSize={setSize} position={positions[index]} />
      ))}
    </SafeAreaView>
  );
}

const Twitter = ({
  instance,
  blankAreaTracker,
  CellRendererComponent,
  disableAutoLayout,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const remainingTweets = useRef([...tweetsData].splice(10, tweetsData.length));
  const [tweets, setTweets] = useState(
    tweetsData
  );
  const viewabilityConfig = useRef<ViewabilityConfig>({
    waitForInteraction: true,
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000,
  }).current;

  return (
    <RecyclerView
      ref={instance}
      keyExtractor={(item) => {
        return item.id;
      }}
      data={tweets}
      renderItem={({ item }) => {
        return <TweetCell tweet={item} />;
      }}
    />
  );
};

export const Divider = () => {
  return <View style={styles.divider} />;
};

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>New tweets available</Text>
    </View>
  );
};

export const Footer = ({ isLoading, isPagingEnabled }) => {
  return (
    <View style={styles.footer}>
      {isLoading && isPagingEnabled ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.footerTitle}>No more tweets</Text>
      )}
    </View>
  );
};

export const Empty = () => {
  const title = 'Welcome to your timeline';
  const subTitle =
    "It's empty now but it won't be for long. Start following peopled you'll see Tweets show up here";
  return (
    <View style={styles.emptyComponent} testID="EmptyComponent">
      <Text style={styles.emptyComponentTitle}>{title}</Text>
      <Text style={styles.emptyComponentSubtitle}>{subTitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#DDD',
  },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1DA1F2',
  },
  footer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  footerTitle: {
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
  },
  emptyComponentTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyComponentSubtitle: {
    color: '#808080',
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyComponent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default Twitter;
